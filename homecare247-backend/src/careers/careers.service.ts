import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';
import { ConvertToStaffDto } from './dto/convert-to-staff.dto.js';
import { ApplicationStatus, Role, UserStatus } from '@prisma/client';

@Injectable()
export class CareersService {
  constructor(private readonly prisma: PrismaService) {}

  private generateApplicationNumber(): string {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    return `APP-${dateStr}-${randomSuffix}`;
  }

  async submitApplication(
    dto: CreateApplicationDto,
    file?: Express.Multer.File,
  ) {
    let resumeUrl = dto.resumeUrl || '';
    let resumeFileName = 'resume.pdf';
    let resumeFileSize = 0;

    if (file) {
      resumeUrl = `/uploads/resumes/${file.filename}`;
      resumeFileName = file.originalname;
      resumeFileSize = file.size;
    }

    if (!resumeUrl) {
      throw new BadRequestException('Please upload a resume file (PDF/DOC) or provide a resumeUrl');
    }

    const applicationNumber = this.generateApplicationNumber();

    const application = await this.prisma.jobApplication.create({
      data: {
        applicationNumber,
        fullName: dto.fullName,
        email: dto.email.toLowerCase().trim(),
        phone: dto.phone,
        roleApplied: dto.roleApplied,
        qualification: dto.qualification,
        experienceYears: Number(dto.experienceYears) || 0,
        currentCity: dto.currentCity,
        preferredCity: dto.preferredCity,
        availableImmediate: dto.availableImmediate ?? true,
        resumeUrl,
        resumeFileName,
        resumeFileSize,
        skills: dto.skills,
        expectedSalary: dto.expectedSalary,
        notes: dto.notes,
        status: ApplicationStatus.NEW,
      },
    });

    return application;
  }

  async findAll(params: {
    status?: ApplicationStatus;
    city?: string;
    roleApplied?: string;
    search?: string;
  }) {
    const { status, city, roleApplied, search } = params;

    return this.prisma.jobApplication.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(city ? { preferredCity: city } : {}),
        ...(roleApplied ? { roleApplied: { contains: roleApplied } } : {}),
        ...(search
          ? {
              OR: [
                { fullName: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } },
                { qualification: { contains: search } },
                { applicationNumber: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return application;
  }

  async updateStatus(
    id: string,
    dto: UpdateApplicationStatusDto,
    reviewerName: string,
  ) {
    await this.findOne(id);

    return this.prisma.jobApplication.update({
      where: { id },
      data: {
        status: dto.status,
        reviewNotes: dto.reviewNotes,
        reviewedBy: reviewerName,
        ...(dto.interviewDate ? { interviewDate: new Date(dto.interviewDate) } : {}),
      },
    });
  }

  async convertToStaff(id: string, dto: ConvertToStaffDto) {
    const application = await this.findOne(id);

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: application.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `A user account already exists with email ${application.email}`,
      );
    }

    const hashedPassword = await bcrypt.hash(dto.temporaryPassword, 10);

    // Create user and nurse profile in transaction
    const newUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: application.email,
          password: hashedPassword,
          name: application.fullName,
          phone: application.phone,
          role: Role.NURSE,
          status: UserStatus.ACTIVE,
          city: application.preferredCity.toLowerCase(),
          nurseProfile: {
            create: {
              qualification: application.qualification,
              experienceYears: application.experienceYears,
              skills: application.skills || 'General Duty Nursing',
              permittedClinicalTasks: JSON.stringify([
                'Bedside vitals charting',
                'Medication administration',
                'General nursing care',
              ]),
              city: application.preferredCity.toLowerCase(),
              availabilityStatus: 'AVAILABLE',
            },
          },
        },
        include: {
          nurseProfile: true,
        },
      });

      // Update application status to HIRED
      await tx.jobApplication.update({
        where: { id },
        data: {
          status: ApplicationStatus.HIRED,
          reviewNotes: `Converted to staff user (${user.id}) by Admin`,
        },
      });

      return user;
    });

    const { password, ...safeUser } = newUser;
    return {
      message: 'Candidate successfully converted to active Nurse account!',
      user: safeUser,
      loginEmail: safeUser.email,
    };
  }

  async getPipelineStats() {
    const statuses = Object.values(ApplicationStatus);
    const stats = await Promise.all(
      statuses.map(async (status) => {
        const count = await this.prisma.jobApplication.count({ where: { status } });
        return { status, count };
      }),
    );

    const total = await this.prisma.jobApplication.count();
    return {
      total,
      breakdown: stats,
    };
  }
}

