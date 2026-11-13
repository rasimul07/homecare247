import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateShiftDto } from './dto/create-shift.dto.js';
import {
  BookingStatus,
  ApplicationStatus,
  ShiftStatus,
  InquiryStatus,
  IncidentStatus,
  JobOfferStatus,
  Role,
  WorkerCategory,
} from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics() {
    const [
      totalBookings,
      newBookings,
      activeBookings,
      completedBookings,
      totalNurses,
      totalCaregivers,
      onDutyStaff,
      availableStaff,
      totalDoctors,
      pendingApplications,
      totalApplications,
      pendingEmergencies,
      openIncidents,
      recentBookings,
      recentApplications,
    ] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: BookingStatus.REQUEST_RECEIVED } }),
      this.prisma.booking.count({
        where: {
          status: {
            in: [
              BookingStatus.CONFIRMED,
              BookingStatus.STAFF_ASSIGNED,
              BookingStatus.STAFF_EN_ROUTE,
              BookingStatus.SERVICE_STARTED,
            ],
          },
        },
      }),
      this.prisma.booking.count({ where: { status: BookingStatus.SERVICE_COMPLETED } }),
      this.prisma.nurseProfile.count({ where: { workerCategory: WorkerCategory.REGISTERED_NURSE } }),
      this.prisma.nurseProfile.count({
        where: {
          workerCategory: { in: [WorkerCategory.AYA_CAREGIVER, WorkerCategory.PATIENT_ATTENDANT] },
        },
      }),
      this.prisma.nurseProfile.count({ where: { availabilityStatus: 'ON_DUTY' } }),
      this.prisma.nurseProfile.count({ where: { availabilityStatus: 'AVAILABLE' } }),
      this.prisma.user.count({ where: { role: Role.DOCTOR, status: 'ACTIVE' } }),
      this.prisma.jobApplication.count({ where: { status: ApplicationStatus.NEW } }),
      this.prisma.jobApplication.count(),
      this.prisma.emergencyRequest.count({ where: { status: InquiryStatus.NEW } }),
      this.prisma.incidentReport.count({ where: { status: IncidentStatus.OPEN } }),
      this.prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedNurse: { select: { name: true, phone: true } },
          assignedDoctor: { select: { name: true } },
          serviceItem: { select: { name: true, isClinical: true } },
        },
      }),
      this.prisma.jobApplication.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      kpi: {
        totalBookings,
        newBookings,
        activeBookings,
        completedBookings,
        totalNurses,
        totalCaregivers,
        onDutyStaff,
        availableStaff,
        totalDoctors,
        pendingApplications,
        totalApplications,
        pendingEmergencies,
        openIncidents,
      },
      recentBookings,
      recentApplications,
    };
  }

  // Automatic Staff Matching Engine (PDF Page 6 - Section D)
  async recommendStaffForBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { serviceItem: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    // Retrieve all active workers with nurseProfile
    const candidates = await this.prisma.user.findMany({
      where: {
        role: { in: [Role.NURSE, Role.CAREGIVER, Role.STAFF] },
        status: 'ACTIVE',
      },
      include: {
        nurseProfile: true,
        shifts: {
          where: {
            shiftDate: booking.startDate,
            status: { in: [ShiftStatus.SCHEDULED, ShiftStatus.EN_ROUTE, ShiftStatus.CHECKED_IN] },
          },
        },
      },
    });

    const results = candidates.map((worker) => {
      const profile = worker.nurseProfile;
      if (!profile) return null;

      let score = 0;
      const reasons: string[] = [];

      // 1. Clinical Scope Enforcement
      if (booking.isClinical) {
        if (profile.workerCategory !== WorkerCategory.REGISTERED_NURSE) {
          return {
            workerId: worker.id,
            name: worker.name,
            phone: worker.phone,
            workerCategory: profile.workerCategory,
            matchScore: 0,
            isEligible: false,
            disqualificationReason: 'Clinical care requires a licensed Registered Nurse (WBNC). Attendants and Ayas are not legally permitted.',
          };
        } else {
          score += 40;
          reasons.push('Qualified Registered Nurse with verified Council credentials (+40)');
        }
      } else {
        // Non-clinical service
        score += 30;
        reasons.push('Meets non-clinical attendant/caregiver scope (+30)');
      }

      // 2. Schedule Conflict Check
      const hasConflict = worker.shifts.length > 0;
      if (hasConflict) {
        return {
          workerId: worker.id,
          name: worker.name,
          phone: worker.phone,
          workerCategory: profile.workerCategory,
          matchScore: 0,
          isEligible: false,
          disqualificationReason: `Shift conflict: Already assigned to another duty on ${booking.startDate}.`,
        };
      } else {
        score += 25;
        reasons.push('Available on requested shift date with no duty conflict (+25)');
      }

      // 3. Location / PIN Code Match
      const serviceAreas: string[] = profile.serviceAreas ? JSON.parse(profile.serviceAreas) : [];
      const servicePinCodes: string[] = profile.servicePinCodes ? JSON.parse(profile.servicePinCodes) : [];

      const areaMatch = serviceAreas.some(
        (a) => a.toLowerCase().includes(booking.area.toLowerCase()) || booking.area.toLowerCase().includes(a.toLowerCase()),
      );
      const pinMatch = booking.pinCode ? servicePinCodes.includes(booking.pinCode) : false;

      if (pinMatch || areaMatch) {
        score += 25;
        reasons.push(`Covers patient locality (${booking.area}) and PIN code (+25)`);
      } else {
        score += 10;
        reasons.push('Nearby coverage within city jurisdiction (+10)');
      }

      // 4. Rating & Experience Bonus
      if (profile.rating >= 4.8) {
        score += 10;
        reasons.push(`High customer satisfaction rating (${profile.rating}★) (+10)`);
      }

      return {
        workerId: worker.id,
        name: worker.name,
        phone: worker.phone,
        email: worker.email,
        workerCategory: profile.workerCategory,
        qualification: profile.qualification,
        experienceYears: profile.experienceYears,
        councilRegistrationNumber: profile.councilRegistrationNumber,
        registrationStatus: profile.registrationStatus,
        policeVerificationStatus: profile.policeVerificationStatus,
        serviceAreas,
        rating: profile.rating,
        matchScore: Math.min(score, 100),
        isEligible: true,
        matchReasons: reasons,
      };
    });

    const eligible = results.filter((r) => r !== null && r.isEligible);
    eligible.sort((a, b) => (b?.matchScore || 0) - (a?.matchScore || 0));

    return {
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        patientName: booking.patientName,
        serviceName: booking.serviceName,
        isClinical: booking.isClinical,
        area: booking.area,
        pinCode: booking.pinCode,
        startDate: booking.startDate,
        shiftDuration: booking.shiftDuration,
      },
      totalEvaluated: candidates.length,
      recommendations: eligible,
    };
  }

  // Admin Dispatches Job Offer to Selected Worker
  async dispatchJobOffer(bookingId: string, workerId: string, actor: { id: string; name: string }) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    const worker = await this.prisma.user.findUnique({ where: { id: workerId } });
    if (!worker) throw new NotFoundException('Worker not found');

    const offer = await this.prisma.jobOffer.create({
      data: {
        bookingId,
        workerId,
        status: JobOfferStatus.PENDING,
      },
    });

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.UNDER_REVIEW,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        bookingId,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: Role.ADMIN,
        action: 'JOB_OFFER_DISPATCHED',
        details: `Dispatched offer to worker: ${worker.name} (${workerId})`,
      },
    });

    return {
      message: `Job offer dispatched to ${worker.name}. Awaiting worker acceptance.`,
      offer,
    };
  }

  async createShift(dto: CreateShiftDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });
    if (!booking) throw new NotFoundException('Patient booking not found');

    const staff = await this.prisma.user.findUnique({
      where: { id: dto.staffId },
    });
    if (!staff) throw new NotFoundException('Staff member not found');

    const shift = await this.prisma.shift.create({
      data: {
        bookingId: dto.bookingId,
        staffId: dto.staffId,
        shiftDate: dto.shiftDate,
        shiftType: dto.shiftType,
        startTime: dto.startTime,
        endTime: dto.endTime,
        notes: dto.notes,
        status: ShiftStatus.SCHEDULED,
      },
      include: {
        booking: { select: { bookingNumber: true, patientName: true, cityName: true } },
        staff: { select: { id: true, name: true, phone: true } },
      },
    });

    if (!booking.assignedNurseId) {
      await this.prisma.booking.update({
        where: { id: dto.bookingId },
        data: {
          assignedNurseId: dto.staffId,
          status: BookingStatus.STAFF_ASSIGNED,
        },
      });
    }

    return shift;
  }

  async getAllShifts(params?: {
    bookingId?: string;
    staffId?: string;
    shiftDate?: string;
    status?: ShiftStatus;
  }) {
    return this.prisma.shift.findMany({
      where: {
        ...(params?.bookingId ? { bookingId: params.bookingId } : {}),
        ...(params?.staffId ? { staffId: params.staffId } : {}),
        ...(params?.shiftDate ? { shiftDate: params.shiftDate } : {}),
        ...(params?.status ? { status: params.status } : {}),
      },
      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            patientName: true,
            contactName: true,
            phone: true,
            cityName: true,
            area: true,
            pinCode: true,
            isClinical: true,
          },
        },
        staff: {
          select: { id: true, name: true, phone: true, role: true },
        },
      },
      orderBy: { shiftDate: 'desc' },
    });
  }

  // Complaints & Incident Register Management (PDF Page 6/7)
  async getIncidents(status?: IncidentStatus) {
    return this.prisma.incidentReport.findMany({
      where: { ...(status ? { status } : {}) },
      include: {
        booking: {
          select: {
            id: true,
            bookingNumber: true,
            patientName: true,
            phone: true,
            area: true,
          },
        },
        reporter: {
          select: { id: true, name: true, phone: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateIncident(
    id: string,
    dto: {
      status: IncidentStatus;
      investigationNotes?: string;
      resolutionNotes?: string;
      replacementWorkerId?: string;
    },
  ) {
    const existing = await this.prisma.incidentReport.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Incident record not found');

    return this.prisma.incidentReport.update({
      where: { id },
      data: {
        status: dto.status,
        investigationNotes: dto.investigationNotes,
        resolutionNotes: dto.resolutionNotes,
        replacementWorkerId: dto.replacementWorkerId,
        resolvedAt: dto.status === IncidentStatus.RESOLVED ? new Date() : undefined,
      },
    });
  }

  // Financial & Invoicing Report (PDF Page 6, 8, 10)
  async getFinancialReports() {
    const invoices = await this.prisma.invoice.findMany({
      include: {
        booking: {
          select: { bookingNumber: true, patientName: true, serviceName: true, isClinical: true },
        },
        customer: {
          select: { name: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalWorkerPayouts = invoices.reduce((sum, inv) => sum + inv.workerPayout, 0);
    const totalAgencyMargin = invoices.reduce((sum, inv) => sum + inv.agencyGrossMargin, 0);
    const totalGstCollected = invoices.reduce(
      (sum, inv) => sum + inv.cgstAmount + inv.sgstAmount + inv.igstAmount,
      0,
    );

    return {
      summary: {
        totalRevenue,
        totalWorkerPayouts,
        totalAgencyMargin,
        totalGstCollected,
        invoiceCount: invoices.length,
      },
      invoices,
    };
  }

  // Audit Logs (PDF Page 6 - Full Activity Log)
  async getAuditLogs(bookingId?: string) {
    return this.prisma.auditLog.findMany({
      where: { ...(bookingId ? { bookingId } : {}) },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
  }

  async getEmergencyRequests(status?: InquiryStatus) {
    return this.prisma.emergencyRequest.findMany({
      where: { ...(status ? { status } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateEmergencyRequest(id: string, status: InquiryStatus) {
    const existing = await this.prisma.emergencyRequest.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Emergency request not found');

    return this.prisma.emergencyRequest.update({
      where: { id },
      data: { status },
    });
  }
}
