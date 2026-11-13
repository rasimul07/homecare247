import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto.js';
import { CreateComplaintDto } from './dto/create-complaint.dto.js';
import { CreateFeedbackDto } from './dto/create-feedback.dto.js';
import { BookingStatus, Role, IncidentStatus } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(customerId: string) {
    const customer = await this.prisma.user.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        address: true,
        pinCode: true,
      },
    });

    if (!customer) throw new NotFoundException('Customer account not found');

    const patientProfiles = await this.prisma.patientProfile.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });

    const bookings = await this.prisma.booking.findMany({
      where: { customerId },
      include: {
        serviceItem: {
          select: {
            id: true,
            name: true,
            division: true,
            isClinical: true,
            iconName: true,
          },
        },
        assignedNurse: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatarUrl: true,
            nurseProfile: {
              select: {
                workerCategory: true,
                qualification: true,
                experienceYears: true,
                rating: true,
                registrationStatus: true,
                policeVerificationStatus: true,
                councilName: true,
                councilRegistrationNumber: true,
                permittedClinicalTasks: true,
              },
            },
          },
        },
        assignedDoctor: {
          select: {
            id: true,
            name: true,
            phone: true,
            doctorProfile: { select: { specialization: true, qualification: true } },
          },
        },
        shifts: {
          orderBy: { shiftDate: 'desc' },
          take: 3,
        },
        clinicalRecords: {
          orderBy: { recordedAt: 'desc' },
          take: 5,
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const activeBookings = bookings.filter(
      (b) =>
        b.status === BookingStatus.CONFIRMED ||
        b.status === BookingStatus.STAFF_ASSIGNED ||
        b.status === BookingStatus.STAFF_EN_ROUTE ||
        b.status === BookingStatus.SERVICE_STARTED,
    );

    const pastBookings = bookings.filter(
      (b) =>
        b.status === BookingStatus.SERVICE_COMPLETED ||
        b.status === BookingStatus.CANCELLED ||
        b.status === BookingStatus.REJECTED,
    );

    return {
      customer,
      patientProfiles,
      activeBookings,
      pastBookings,
      totalBookings: bookings.length,
    };
  }

  async getPatientProfiles(customerId: string) {
    return this.prisma.patientProfile.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPatientProfile(customerId: string, dto: CreatePatientProfileDto) {
    return this.prisma.patientProfile.create({
      data: {
        customerId,
        fullName: dto.fullName,
        age: dto.age,
        gender: dto.gender,
        relationship: dto.relationship,
        primaryDiagnosis: dto.primaryDiagnosis,
        medicalHistory: dto.medicalHistory,
        hospitalDischargeSummary: dto.hospitalDischargeSummary,
        mobilityStatus: dto.mobilityStatus,
        emergencyContactName: dto.emergencyContactName,
        emergencyContactPhone: dto.emergencyContactPhone,
      },
    });
  }

  async cancelBooking(customerId: string, bookingId: string, reason: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, customerId },
    });

    if (!booking) throw new NotFoundException('Booking not found under this customer account');

    if (booking.status === BookingStatus.SERVICE_STARTED) {
      throw new BadRequestException(
        'Duty has already started. Please contact customer coordinator for immediate assistance.',
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancellationReason: reason,
        },
      });

      await tx.auditLog.create({
        data: {
          bookingId,
          actorId: customerId,
          actorName: booking.contactName,
          actorRole: Role.CUSTOMER,
          action: 'CUSTOMER_CANCELLED_BOOKING',
          details: `Reason: ${reason}`,
        },
      });

      return b;
    });

    return {
      message: 'Booking cancellation recorded successfully.',
      booking: updated,
    };
  }

  async submitComplaint(customerId: string, dto: CreateComplaintDto) {
    const user = await this.prisma.user.findUnique({ where: { id: customerId } });
    if (!user) throw new NotFoundException('Customer not found');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const incidentNumber = `INC-${new Date().getFullYear()}-${randomSuffix}`;

    const incident = await this.prisma.incidentReport.create({
      data: {
        incidentNumber,
        bookingId: dto.bookingId,
        reporterId: customerId,
        reporterRole: Role.CUSTOMER,
        incidentType: dto.incidentType,
        severity: dto.severity || 'MEDIUM',
        description: dto.description,
        patientConditionAtIncident: dto.patientConditionAtIncident,
        status: IncidentStatus.OPEN,
      },
    });

    return {
      message: 'Complaint registered. Our Quality & Safety Manager will review and contact you.',
      incidentNumber: incident.incidentNumber,
      incident,
    };
  }

  async submitFeedback(customerId: string, dto: CreateFeedbackDto) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: dto.bookingId, customerId },
      include: { assignedNurse: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    // Update nurse completed shifts and average rating if nurse assigned
    if (booking.assignedNurseId) {
      const nurseProfile = await this.prisma.nurseProfile.findUnique({
        where: { userId: booking.assignedNurseId },
      });

      if (nurseProfile) {
        const newRating = Number(
          ((nurseProfile.rating * 5 + dto.rating) / 6).toFixed(2),
        );
        await this.prisma.nurseProfile.update({
          where: { userId: booking.assignedNurseId },
          data: { rating: newRating },
        });
      }
    }

    return {
      message: 'Thank you for your valuable feedback!',
      rating: dto.rating,
      comment: dto.comment,
    };
  }
}
