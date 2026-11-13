import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import { AssignStaffDto } from './dto/assign-staff.dto.js';
import { BookingStatus, Role, PaymentStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateBookingNumber(): string {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    return `HC-${dateStr}-${randomSuffix}`;
  }

  private generateInvoiceNumber(): string {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    return `INV-WB-${year}-${randomSuffix}`;
  }

  async create(createBookingDto: CreateBookingDto) {
    const service = await this.prisma.serviceItem.findUnique({
      where: { id: createBookingDto.serviceId },
    });

    const isClinical = service ? service.isClinical : (createBookingDto.isClinical ?? false);
    const bookingNumber = this.generateBookingNumber();

    // Calculate Unit Economics (Page 8 of PDF)
    const baseDailyRate = service ? service.startingPrice : 1500;
    // Example: Customer pays 1500, worker gets 1100, agency margin 400
    const workerPayoutRate = Math.round(baseDailyRate * 0.733);
    const agencyMargin = baseDailyRate - workerPayoutRate;

    // 18% GST (9% CGST + 9% SGST for West Bengal)
    const gstRate = 18.0;
    const gstAmount = Math.round((agencyMargin * gstRate) / 100);
    const cgstAmount = Math.round(gstAmount / 2);
    const sgstAmount = gstAmount - cgstAmount;
    const totalAmount = baseDailyRate + gstAmount;

    const booking = await this.prisma.$transaction(async (tx) => {
      const b = await tx.booking.create({
        data: {
          bookingNumber,
          customerId: createBookingDto.customerId,
          patientProfileId: createBookingDto.patientProfileId,
          patientName: createBookingDto.patientName,
          patientAge: createBookingDto.patientAge,
          patientGender: createBookingDto.patientGender,
          contactName: createBookingDto.contactName,
          phone: createBookingDto.phone,
          email: createBookingDto.email,
          cityId: createBookingDto.cityId,
          cityName: createBookingDto.cityName,
          area: createBookingDto.area,
          pinCode: createBookingDto.pinCode,
          address: createBookingDto.address,
          landmark: createBookingDto.landmark,
          serviceId: createBookingDto.serviceId,
          serviceName: createBookingDto.serviceName,
          isClinical,
          shiftDuration: createBookingDto.shiftDuration || '12d',
          patientCondition: createBookingDto.patientCondition,
          hospitalDischargeInfo: createBookingDto.hospitalDischargeInfo,
          startDate: createBookingDto.startDate,
          preferredStartTime: createBookingDto.preferredStartTime || '08:00 AM',
          endDate: createBookingDto.endDate,
          notes: createBookingDto.notes,
          isEmergency: createBookingDto.isEmergency ?? false,
          status: BookingStatus.REQUEST_RECEIVED,
          totalAmount,
          workerPayoutRate,
          agencyMargin,
          consentAcknowledged: createBookingDto.consentAcknowledged ?? true,
          consentTimestamp: new Date(),
        },
      });

      // If customer is registered, auto-generate initial invoice/receipt draft
      if (createBookingDto.customerId) {
        await tx.invoice.create({
          data: {
            invoiceNumber: this.generateInvoiceNumber(),
            bookingId: b.id,
            customerId: createBookingDto.customerId,
            baseAmount: baseDailyRate,
            workerPayout: workerPayoutRate,
            agencyGrossMargin: agencyMargin,
            gstRate,
            cgstAmount,
            sgstAmount,
            igstAmount: 0,
            totalAmount,
            paymentMethod: PaymentMethod.UPI,
            paymentStatus: PaymentStatus.PENDING,
            sacCode: isClinical ? '9993' : '9985',
          },
        });
      }

      // Record Audit Log
      await tx.auditLog.create({
        data: {
          bookingId: b.id,
          actorId: createBookingDto.customerId || 'system',
          actorName: createBookingDto.contactName,
          actorRole: createBookingDto.customerId ? Role.CUSTOMER : Role.STAFF,
          action: 'BOOKING_REQUEST_RECEIVED',
          details: `Patient: ${createBookingDto.patientName}, Service: ${createBookingDto.serviceName}, Area: ${createBookingDto.area} (PIN: ${createBookingDto.pinCode || 'N/A'}), Clinical: ${isClinical}`,
        },
      });

      return b;
    });

    return booking;
  }

  async findAll(params: {
    status?: BookingStatus;
    cityId?: string;
    area?: string;
    nurseId?: string;
    doctorId?: string;
    isClinical?: boolean;
    isEmergency?: boolean;
    search?: string;
  }) {
    const { status, cityId, area, nurseId, doctorId, isClinical, isEmergency, search } = params;

    return this.prisma.booking.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(cityId ? { cityId } : {}),
        ...(area ? { area: { contains: area } } : {}),
        ...(nurseId ? { assignedNurseId: nurseId } : {}),
        ...(doctorId ? { assignedDoctorId: doctorId } : {}),
        ...(isClinical !== undefined ? { isClinical } : {}),
        ...(isEmergency !== undefined ? { isEmergency } : {}),
        ...(search
          ? {
              OR: [
                { bookingNumber: { contains: search } },
                { patientName: { contains: search } },
                { contactName: { contains: search } },
                { phone: { contains: search } },
                { area: { contains: search } },
                { pinCode: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        serviceItem: {
          select: {
            id: true,
            name: true,
            division: true,
            isClinical: true,
            requiredQualification: true,
            iconName: true,
          },
        },
        assignedNurse: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            nurseProfile: {
              select: {
                workerCategory: true,
                qualification: true,
                councilName: true,
                councilRegistrationNumber: true,
                registrationStatus: true,
                policeVerificationStatus: true,
                rating: true,
              },
            },
          },
        },
        assignedDoctor: {
          select: { id: true, name: true, phone: true, email: true, doctorProfile: true },
        },
        shifts: {
          orderBy: { shiftDate: 'asc' },
        },
        _count: {
          select: { shifts: true, clinicalRecords: true, jobOffers: true, incidents: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        serviceItem: true,
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        patientProfile: true,
        assignedNurse: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            nurseProfile: true,
          },
        },
        assignedDoctor: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            doctorProfile: true,
          },
        },
        shifts: {
          orderBy: { shiftDate: 'asc' },
          include: { staff: { select: { id: true, name: true, phone: true } } },
        },
        clinicalRecords: {
          orderBy: { recordedAt: 'desc' },
        },
        jobOffers: {
          include: {
            worker: { select: { id: true, name: true, phone: true } },
          },
        },
        incidents: true,
        invoices: true,
        auditLogs: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(id: string, updateDto: UpdateBookingDto, actor?: { id: string; name: string; role: Role }) {
    const booking = await this.findOne(id);

    const updated = await this.prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id },
        data: updateDto,
        include: {
          assignedNurse: { select: { id: true, name: true } },
          assignedDoctor: { select: { id: true, name: true } },
        },
      });

      if (actor) {
        await tx.auditLog.create({
          data: {
            bookingId: id,
            actorId: actor.id,
            actorName: actor.name,
            actorRole: actor.role,
            action: `BOOKING_UPDATED_STATUS_${updateDto.status || 'MODIFIED'}`,
            details: `Updated fields: ${Object.keys(updateDto).join(', ')}`,
          },
        });
      }

      return b;
    });

    return updated;
  }

  async assignStaff(id: string, assignStaffDto: AssignStaffDto, actor?: { id: string; name: string; role: Role }) {
    const booking = await this.findOne(id);

    // Clinical verification check (PDF Page 3 & 4)
    if (booking.isClinical && assignStaffDto.assignedNurseId) {
      const workerProfile = await this.prisma.nurseProfile.findUnique({
        where: { userId: assignStaffDto.assignedNurseId },
      });

      if (!workerProfile || workerProfile.workerCategory !== 'REGISTERED_NURSE') {
        throw new BadRequestException(
          'CLINICAL SAFETY RULE: Clinical procedures, medication, and nursing interventions must only be assigned to a REGISTERED NURSE with verified Nursing Council credentials.',
        );
      }
    }

    const dataToUpdate: any = {};
    if (assignStaffDto.assignedNurseId !== undefined) {
      dataToUpdate.assignedNurseId = assignStaffDto.assignedNurseId || null;
    }
    if (assignStaffDto.assignedDoctorId !== undefined) {
      dataToUpdate.assignedDoctorId = assignStaffDto.assignedDoctorId || null;
    }
    if (assignStaffDto.notes) {
      dataToUpdate.notes = booking.notes
        ? `${booking.notes}\n[Assignment Note]: ${assignStaffDto.notes}`
        : assignStaffDto.notes;
    }

    if (assignStaffDto.assignedNurseId || assignStaffDto.assignedDoctorId) {
      if (
        booking.status === BookingStatus.REQUEST_RECEIVED ||
        booking.status === BookingStatus.UNDER_REVIEW ||
        booking.status === BookingStatus.CONFIRMED
      ) {
        dataToUpdate.status = BookingStatus.STAFF_ASSIGNED;
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id },
        data: dataToUpdate,
        include: {
          assignedNurse: { select: { id: true, name: true, phone: true, nurseProfile: true } },
          assignedDoctor: { select: { id: true, name: true, phone: true, doctorProfile: true } },
        },
      });

      if (actor) {
        await tx.auditLog.create({
          data: {
            bookingId: id,
            actorId: actor.id,
            actorName: actor.name,
            actorRole: actor.role,
            action: 'STAFF_ASSIGNED_BY_ADMIN',
            details: `Assigned Nurse: ${assignStaffDto.assignedNurseId || 'None'}, Doctor: ${assignStaffDto.assignedDoctorId || 'None'}`,
          },
        });
      }

      return b;
    });

    return updated;
  }
}
