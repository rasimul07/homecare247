import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDoctorNoteDto } from './dto/create-doctor-note.dto.js';
import { BookingStatus, Role } from '@prisma/client';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(doctorId: string) {
    const assignedBookings = await this.prisma.booking.findMany({
      where: { assignedDoctorId: doctorId },
      include: {
        assignedNurse: { select: { id: true, name: true, phone: true } },
        clinicalRecords: {
          take: 3,
          orderBy: { recordedAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const activePatientsCount = assignedBookings.filter(
      (b) =>
        b.status === BookingStatus.SERVICE_STARTED ||
        b.status === BookingStatus.STAFF_EN_ROUTE ||
        b.status === BookingStatus.STAFF_ASSIGNED,
    ).length;

    const totalSupervised = assignedBookings.length;
    const completedCases = assignedBookings.filter(
      (b) => b.status === BookingStatus.SERVICE_COMPLETED,
    ).length;

    // Get doctor profile
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      include: { doctorProfile: true },
    });

    return {
      doctorName: doctor?.name,
      specialization: doctor?.doctorProfile?.specialization,
      stats: {
        activePatients: activePatientsCount,
        totalSupervised,
        completedCases,
      },
      patients: assignedBookings,
    };
  }

  async getMyPatients(doctorId: string) {
    return this.prisma.booking.findMany({
      where: { assignedDoctorId: doctorId },
      include: {
        assignedNurse: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            nurseProfile: true,
          },
        },
        clinicalRecords: {
          take: 5,
          orderBy: { recordedAt: 'desc' },
        },
        shifts: {
          where: { status: 'CHECKED_IN' },
          include: { staff: { select: { id: true, name: true, phone: true } } },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async addClinicalNote(doctorId: string, doctorName: string, dto: CreateDoctorNoteDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Patient booking not found');
    }

    const record = await this.prisma.clinicalRecord.create({
      data: {
        bookingId: dto.bookingId,
        recordedById: doctorId,
        recordedByName: `Dr. ${doctorName.replace(/^Dr\.\s*/i, '')}`,
        recordedByRole: Role.DOCTOR,
        clinicalNotes: dto.clinicalNotes,
        doctorRecommendations: dto.doctorRecommendations,
        medicationAdministered: dto.medicationAdministered,
        bloodPressure: dto.bloodPressure,
        heartRate: dto.heartRate,
        spO2: dto.spO2,
        temperature: dto.temperature,
      },
    });

    return record;
  }

  async getClinicalHistory(bookingId: string) {
    const records = await this.prisma.clinicalRecord.findMany({
      where: { bookingId },
      orderBy: { recordedAt: 'desc' },
      include: {
        recordedBy: { select: { id: true, name: true, role: true } },
      },
    });

    return records;
  }
}

