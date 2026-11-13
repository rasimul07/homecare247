import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorService } from './doctor.service.js';
import { CreateDoctorNoteDto } from './dto/create-doctor-note.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator.js';
import { Role } from '@prisma/client';

@ApiTags('Doctor Portal')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
@Roles(Role.DOCTOR, Role.ADMIN)
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Doctor Dashboard: Active supervised patients, clinical summaries & metrics',
  })
  async getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.doctorService.getDashboard(user.id);
  }

  @Get('patients')
  @ApiOperation({ summary: 'List all patients assigned to this doctor' })
  async getMyPatients(@CurrentUser() user: AuthenticatedUser) {
    return this.doctorService.getMyPatients(user.id);
  }

  @Post('clinical-notes')
  @ApiOperation({
    summary: 'Add Clinical Progress Assessment, Medicine Adjustments & Nurse Orders',
  })
  async addClinicalNote(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateDoctorNoteDto,
  ) {
    return this.doctorService.addClinicalNote(user.id, user.name, dto);
  }

  @Get('clinical-notes/:bookingId')
  @ApiOperation({ summary: 'Get full clinical history and bedside vitals records for a patient' })
  async getClinicalHistory(@Param('bookingId') bookingId: string) {
    return this.doctorService.getClinicalHistory(bookingId);
  }
}

