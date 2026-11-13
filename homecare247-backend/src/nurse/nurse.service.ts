import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CheckInDto } from './dto/check-in.dto.js';
import { CheckOutDto } from './dto/check-out.dto.js';
import { RecordVitalsDto } from './dto/record-vitals.dto.js';
import { UpdateAvailabilityDto } from './dto/update-availability.dto.js';
import {
  Role,
  ShiftStatus,
  BookingStatus,
  JobOfferStatus,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
} from '@prisma/client';

@Injectable()
export class NurseService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(nurseId: string) {
    const nurse = await this.prisma.user.findUnique({
      where: { id: nurseId },
      include: { nurseProfile: true },
    });

    if (!nurse) throw new NotFoundException('Nurse profile not found');

    const pendingJobOffers = await this.prisma.jobOffer.findMany({
      where: { workerId: nurseId, status: JobOfferStatus.PENDING },
      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            serviceName: true,
            isClinical: true,
            area: true,
            pinCode: true,
            startDate: true,
            shiftDuration: true,
            patientCondition: true,
            preferredStartTime: true,
          },
        },
      },
    });

    const activeShift = await this.prisma.shift.findFirst({
      where: {
        staffId: nurseId,
        status: { in: [ShiftStatus.CHECKED_IN, ShiftStatus.EN_ROUTE] },
      },
      include: {
        booking: {
          include: {
            assignedDoctor: { select: { id: true, name: true, phone: true } },
          },
        },
      },
    });

    const upcomingShifts = await this.prisma.shift.findMany({
      where: {
        staffId: nurseId,
        status: ShiftStatus.SCHEDULED,
      },
      include: {
        booking: {
          select: {
            bookingNumber: true,
            patientName: true,
            phone: true,
            area: true,
            address: true,
            pinCode: true,
            patientCondition: true,
            serviceName: true,
            isClinical: true,
          },
        },
      },
      orderBy: { shiftDate: 'asc' },
      take: 5,
    });

    return {
      nurse: {
        id: nurse.id,
        name: nurse.name,
        phone: nurse.phone,
        city: nurse.city,
        profile: nurse.nurseProfile,
      },
      pendingJobOffers,
      activeShift,
      upcomingShifts,
    };
  }

  // Job Offer Accept / Reject (PDF Page 6 - Nurse / Caregiver Portal)
  async respondToJobOffer(
    nurseId: string,
    offerId: string,
    accept: boolean,
    rejectionReason?: string,
  ) {
    const offer = await this.prisma.jobOffer.findUnique({
      where: { id: offerId },
      include: { booking: true },
    });

    if (!offer) throw new NotFoundException('Job offer not found');
    if (offer.workerId !== nurseId) throw new BadRequestException('Offer was not issued to this worker');

    if (accept) {
      const updated = await this.prisma.$transaction(async (tx) => {
        const off = await tx.jobOffer.update({
          where: { id: offerId },
          data: {
            status: JobOfferStatus.ACCEPTED,
            respondedAt: new Date(),
          },
        });

        // Confirm booking and assign nurse
        await tx.booking.update({
          where: { id: offer.bookingId },
          data: {
            assignedNurseId: nurseId,
            status: BookingStatus.CONFIRMED,
          },
        });

        // Automatically create scheduled shift
        await tx.shift.create({
          data: {
            bookingId: offer.bookingId,
            staffId: nurseId,
            shiftDate: offer.booking.startDate,
            shiftType: offer.booking.shiftDuration,
            startTime: offer.booking.preferredStartTime || '08:00 AM',
            endTime: '08:00 PM',
            status: ShiftStatus.SCHEDULED,
          },
        });

        // Audit log
        await tx.auditLog.create({
          data: {
            bookingId: offer.bookingId,
            actorId: nurseId,
            actorName: 'Assigned Worker',
            actorRole: Role.NURSE,
            action: 'WORKER_ACCEPTED_JOB_OFFER',
            details: `Booking ${offer.booking.bookingNumber} confirmed upon worker acceptance`,
          },
        });

        return off;
      });

      return { message: 'Job offer accepted! Shift scheduled and booking confirmed.', offer: updated };
    } else {
      const updated = await this.prisma.jobOffer.update({
        where: { id: offerId },
        data: {
          status: JobOfferStatus.REJECTED,
          respondedAt: new Date(),
          rejectionReason: rejectionReason || 'Unavailable for this time',
        },
      });

      await this.prisma.auditLog.create({
        data: {
          bookingId: offer.bookingId,
          actorId: nurseId,
          actorName: 'Candidate Worker',
          actorRole: Role.NURSE,
          action: 'WORKER_REJECTED_JOB_OFFER',
          details: `Reason: ${rejectionReason || 'Unavailable'}`,
        },
      });

      return { message: 'Job offer rejection recorded without penalty.', offer: updated };
    }
  }

  // Worker En Route (PDF Page 5 & 7 - Live Arrival Status)
  async setEnRoute(nurseId: string, shiftId: string) {
    const shift = await this.prisma.shift.findUnique({
      where: { id: shiftId },
      include: { booking: true },
    });

    if (!shift) throw new NotFoundException('Shift not found');
    if (shift.staffId !== nurseId) throw new BadRequestException('Not assigned to this shift');

    const updated = await this.prisma.$transaction(async (tx) => {
      const s = await tx.shift.update({
        where: { id: shiftId },
        data: {
          status: ShiftStatus.EN_ROUTE,
          enRouteTime: new Date(),
        },
      });

      // Update booking status to STAFF_EN_ROUTE
      await tx.booking.update({
        where: { id: shift.bookingId },
        data: { status: BookingStatus.STAFF_EN_ROUTE },
      });

      await tx.auditLog.create({
        data: {
          bookingId: shift.bookingId,
          actorId: nurseId,
          actorName: 'Staff Member',
          actorRole: Role.NURSE,
          action: 'STAFF_EN_ROUTE',
          details: `Staff started journey to patient address: ${shift.booking.address || shift.booking.area}`,
        },
      });

      return s;
    });

    return {
      message: 'Status updated to En Route! Customer notified that worker is on the way.',
      shift: updated,
    };
  }

  async checkIn(nurseId: string, shiftId: string, dto: CheckInDto) {
    const shift = await this.prisma.shift.findUnique({
      where: { id: shiftId },
      include: { booking: true },
    });

    if (!shift) throw new NotFoundException('Shift not found');
    if (shift.staffId !== nurseId) throw new BadRequestException('Not assigned to this shift');

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedShift = await tx.shift.update({
        where: { id: shiftId },
        data: {
          status: ShiftStatus.CHECKED_IN,
          checkInTime: new Date(),
          notes: dto.notes ? `[Check-In Note]: ${dto.notes}` : shift.notes,
        },
      });

      await tx.booking.update({
        where: { id: shift.bookingId },
        data: { status: BookingStatus.SERVICE_STARTED },
      });

      await tx.nurseProfile.updateMany({
        where: { userId: nurseId },
        data: { availabilityStatus: 'ON_DUTY' },
      });

      await tx.auditLog.create({
        data: {
          bookingId: shift.bookingId,
          actorId: nurseId,
          actorName: 'Staff Member',
          actorRole: Role.NURSE,
          action: 'SERVICE_STARTED_CHECK_IN',
          details: dto.notes || 'Arrived at patient home and commenced duty',
        },
      });

      return updatedShift;
    });

    return {
      message: 'Check-in confirmed successfully! Shift duty is now active.',
      shift: updated,
    };
  }

  async checkOut(nurseId: string, shiftId: string, dto: CheckOutDto) {
    const shift = await this.prisma.shift.findUnique({
      where: { id: shiftId },
      include: { booking: true },
    });

    if (!shift) throw new NotFoundException('Shift not found');
    if (shift.staffId !== nurseId) throw new BadRequestException('Not assigned to this shift');

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedShift = await tx.shift.update({
        where: { id: shiftId },
        data: {
          status: ShiftStatus.CHECKED_OUT,
          checkOutTime: new Date(),
          dailyCareReport: dto.notes,
          notes: dto.notes,
          patientVitalsSummary: dto.patientVitalsSummary,
        },
      });

      await tx.booking.update({
        where: { id: shift.bookingId },
        data: { status: BookingStatus.SERVICE_COMPLETED },
      });

      await tx.nurseProfile.updateMany({
        where: { userId: nurseId },
        data: {
          availabilityStatus: 'AVAILABLE',
          completedShifts: { increment: 1 },
        },
      });

      await tx.auditLog.create({
        data: {
          bookingId: shift.bookingId,
          actorId: nurseId,
          actorName: 'Staff Member',
          actorRole: Role.NURSE,
          action: 'SERVICE_COMPLETED_CHECK_OUT',
          details: `Check-out recorded with care summary: ${dto.notes || 'None'}`,
        },
      });

      return updatedShift;
    });

    return {
      message: 'Check-out recorded! Shift marked complete.',
      shift: updated,
    };
  }

  // Worker Incident & Safety Reporting (PDF Page 6 & 7)
  async reportIncident(
    nurseId: string,
    dto: {
      bookingId?: string;
      incidentType: IncidentType;
      severity?: IncidentSeverity;
      description: string;
      escalatedToEmergency?: boolean;
    },
  ) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const incidentNumber = `INC-WORKER-${new Date().getFullYear()}-${randomSuffix}`;

    const incident = await this.prisma.incidentReport.create({
      data: {
        incidentNumber,
        bookingId: dto.bookingId,
        reporterId: nurseId,
        reporterRole: Role.NURSE,
        incidentType: dto.incidentType,
        severity: dto.severity || 'HIGH',
        description: dto.description,
        escalatedToEmergency: dto.escalatedToEmergency || false,
        status: IncidentStatus.OPEN,
      },
    });

    return {
      message: 'Incident reported to Operations and Safety Lead immediately.',
      incidentNumber: incident.incidentNumber,
      incident,
    };
  }

  async getShifts(nurseId: string) {
    return this.prisma.shift.findMany({
      where: { staffId: nurseId },
      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            patientName: true,
            phone: true,
            area: true,
            pinCode: true,
            address: true,
            landmark: true,
            patientCondition: true,
            serviceName: true,
            isClinical: true,
          },
        },
      },
      orderBy: { shiftDate: 'desc' },
    });
  }

  async getPayoutHistory(nurseId: string) {
    const completedShifts = await this.prisma.shift.findMany({
      where: { staffId: nurseId, status: ShiftStatus.CHECKED_OUT },
      include: {
        booking: {
          select: { bookingNumber: true, patientName: true, workerPayoutRate: true },
        },
      },
      orderBy: { shiftDate: 'desc' },
    });

    const totalEarned = completedShifts.reduce(
      (sum, s) => sum + (s.booking.workerPayoutRate || 1100),
      0,
    );

    return {
      totalCompletedShifts: completedShifts.length,
      totalEarned,
      history: completedShifts,
    };
  }

  async recordVitals(nurseId: string, nurseName: string, dto: RecordVitalsDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) throw new NotFoundException('Patient booking not found');

    const record = await this.prisma.clinicalRecord.create({
      data: {
        bookingId: dto.bookingId,
        recordedById: nurseId,
        recordedByName: nurseName,
        recordedByRole: Role.NURSE,
        bloodPressure: dto.bloodPressure,
        heartRate: dto.heartRate,
        spO2: dto.spO2,
        temperature: dto.temperature,
        respiratoryRate: dto.respiratoryRate,
        bloodSugar: dto.bloodSugar,
        clinicalNotes: dto.clinicalNotes,
        medicationAdministered: dto.medicationAdministered,
      },
    });

    return record;
  }

  async updateAvailability(nurseId: string, dto: UpdateAvailabilityDto) {
    const profile = await this.prisma.nurseProfile.updateMany({
      where: { userId: nurseId },
      data: { availabilityStatus: dto.availabilityStatus },
    });

    if (profile.count === 0) {
      throw new NotFoundException('Nurse profile not found for this user');
    }

    return {
      message: `Availability status updated to ${dto.availabilityStatus}`,
      availabilityStatus: dto.availabilityStatus,
    };
  }
}
