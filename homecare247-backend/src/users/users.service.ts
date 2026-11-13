import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto.js';
import { CreateNurseProfileDto } from './dto/create-nurse-profile.dto.js';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(role?: Role, city?: string) {
    return this.prisma.user.findMany({
      where: {
        ...(role ? { role } : {}),
        ...(city ? { city } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        city: true,
        status: true,
        avatarUrl: true,
        doctorProfile: true,
        nurseProfile: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findDoctors(city?: string) {
    return this.prisma.user.findMany({
      where: {
        role: Role.DOCTOR,
        status: 'ACTIVE',
        ...(city ? { city } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        avatarUrl: true,
        doctorProfile: true,
      },
    });
  }

  async findNurses(city?: string, availabilityStatus?: string) {
    return this.prisma.user.findMany({
      where: {
        role: Role.NURSE,
        status: 'ACTIVE',
        ...(city ? { city } : {}),
        ...(availabilityStatus
          ? {
              nurseProfile: {
                availabilityStatus,
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        avatarUrl: true,
        nurseProfile: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        doctorProfile: true,
        nurseProfile: true,
        assignedNurseBookings: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        assignedDoctorBookings: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...result } = user;
    return result;
  }

  async upsertDoctorProfile(userId: string, dto: CreateDoctorProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== Role.DOCTOR && user.role !== Role.ADMIN) {
      throw new ConflictException('User is not designated as a DOCTOR');
    }

    return this.prisma.doctorProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...dto,
      },
      update: dto,
    });
  }

  async upsertNurseProfile(userId: string, dto: CreateNurseProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== Role.NURSE && user.role !== Role.STAFF && user.role !== Role.ADMIN) {
      throw new ConflictException('User is not designated as a NURSE or STAFF');
    }

    const permittedTasks =
      dto.permittedClinicalTasks ||
      JSON.stringify(['Vital signs charting', 'Bedside nursing care', 'Patient hygiene support']);

    return this.prisma.nurseProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...dto,
        permittedClinicalTasks: permittedTasks,
      },
      update: {
        ...dto,
        permittedClinicalTasks: permittedTasks,
      },
    });
  }
}

