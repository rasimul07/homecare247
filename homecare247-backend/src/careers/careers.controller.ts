import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Res,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { Response } from 'express';
import { CareersService } from './careers.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';
import { ConvertToStaffDto } from './dto/convert-to-staff.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator.js';
import { ApplicationStatus, Role } from '@prisma/client';

const uploadDir = './uploads/resumes';
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

export const resumeMulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileExt = extname(file.originalname);
      cb(null, `resume-${uniqueSuffix}${fileExt}`);
    },
  }),
  fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
    const allowedMime = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException('Only PDF, DOC, DOCX, JPG, and PNG files are accepted as resumes'),
        false,
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
};

@ApiTags('Nurse & Staff Careers / Hiring Portal')
@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Public()
  @Post('apply')
  @UseInterceptors(FileInterceptor('resume', resumeMulterOptions))
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({
    summary: 'Submit Nurse / Healthcare Staff Job Application & Resume (Public)',
    description: 'Allows nurses, caregivers, and medical attendants to upload their CV and submit clinical credentials for hire.',
  })
  @ApiBody({
    description: 'Nurse application data with optional resume file',
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'Sushmita Mukherjee' },
        email: { type: 'string', example: 'sushmita.nurse@gmail.com' },
        phone: { type: 'string', example: '+91 98311 55443' },
        roleApplied: { type: 'string', example: 'Critical Care ICU Nurse' },
        qualification: { type: 'string', example: 'B.Sc Nursing (WBNC Registered)' },
        experienceYears: { type: 'number', example: 5 },
        currentCity: { type: 'string', example: 'Kolkata' },
        preferredCity: { type: 'string', example: 'Kolkata' },
        availableImmediate: { type: 'boolean', example: true },
        skills: { type: 'string', example: 'ICU Care, Ventilator Support, Tracheostomy' },
        expectedSalary: { type: 'string', example: '₹35,000 / month' },
        notes: { type: 'string', example: 'Available for 12-hour night shifts' },
        resume: { type: 'string', format: 'binary', description: 'Resume file (PDF/DOC/DOCX)' },
      },
      required: ['fullName', 'email', 'phone', 'roleApplied', 'qualification', 'experienceYears', 'currentCity', 'preferredCity'],
    },
  })
  async submitApplication(
    @Body() dto: CreateApplicationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.careersService.submitApplication(dto, file);
  }

  @Public()
  @Get('resumes/:fileName')
  @ApiOperation({ summary: 'View or Download candidate resume file' })
  async getResumeFile(@Param('fileName') fileName: string, @Res() res: Response) {
    const safePath = join(process.cwd(), 'uploads', 'resumes', fileName);
    if (!existsSync(safePath)) {
      throw new BadRequestException('Requested resume file not found');
    }
    return res.sendFile(safePath);
  }

  @Get('applications')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List and filter nurse job applications for HR / Hiring (Admin Only)' })
  @ApiQuery({ name: 'status', enum: ApplicationStatus, required: false })
  @ApiQuery({ name: 'city', type: String, required: false })
  @ApiQuery({ name: 'roleApplied', type: String, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async findAll(
    @Query('status') status?: ApplicationStatus,
    @Query('city') city?: string,
    @Query('roleApplied') roleApplied?: string,
    @Query('search') search?: string,
  ) {
    return this.careersService.findAll({ status, city, roleApplied, search });
  }

  @Get('stats')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get nurse recruitment pipeline statistics (Admin Dashboard)' })
  async getPipelineStats() {
    return this.careersService.getPipelineStats();
  }

  @Get('applications/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get full candidate application, resume link, and hiring history' })
  async findOne(@Param('id') id: string) {
    return this.careersService.findOne(id);
  }

  @Patch('applications/:id/status')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update candidate hiring stage (Shortlist, Interview, Hire, Reject)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.careersService.updateStatus(id, dto, user.name);
  }

  @Post('applications/:id/convert-to-staff')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'One-Click Hire: Convert candidate to active Nurse user account (Admin Only)',
    description: 'Automatically creates a User account with NURSE role and initialized NurseProfile.',
  })
  async convertToStaff(
    @Param('id') id: string,
    @Body() dto: ConvertToStaffDto,
  ) {
    return this.careersService.convertToStaff(id, dto);
  }
}

