import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import { AssignStaffDto } from './dto/assign-staff.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator.js';
import { BookingStatus, Role } from '@prisma/client';

@ApiTags('Patient Bookings & Clinical Inquiries')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Submit Patient Booking Inquiry (Public - Landing Page & Portals)',
    description: 'Allows patients and family members to place bookings with location, PIN code, medical details and consent.',
  })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'List bookings with status/city/personnel filtering (Admin, Doctors, Nurses)',
  })
  @ApiQuery({ name: 'status', enum: BookingStatus, required: false })
  @ApiQuery({ name: 'cityId', type: String, required: false })
  @ApiQuery({ name: 'area', type: String, required: false })
  @ApiQuery({ name: 'nurseId', type: String, required: false })
  @ApiQuery({ name: 'doctorId', type: String, required: false })
  @ApiQuery({ name: 'isClinical', type: Boolean, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: BookingStatus,
    @Query('cityId') cityId?: string,
    @Query('area') area?: string,
    @Query('nurseId') nurseId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('isClinical') isClinical?: boolean,
    @Query('search') search?: string,
  ) {
    let finalNurseId = nurseId;
    let finalDoctorId = doctorId;

    if (user.role === Role.NURSE || user.role === Role.CAREGIVER) {
      finalNurseId = user.id;
    } else if (user.role === Role.DOCTOR) {
      finalDoctorId = user.id;
    }

    return this.bookingsService.findAll({
      status,
      cityId,
      area,
      nurseId: finalNurseId,
      doctorId: finalDoctorId,
      isClinical,
      search,
    });
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get detailed booking record, assigned staff, shifts, invoices, and audit log' })
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update booking status, dates, notes, or fee' })
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bookingsService.update(id, updateBookingDto, {
      id: user.id,
      name: user.name,
      role: user.role as Role,
    });
  }

  @Patch(':id/assign')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Assign Nurse and/or Supervising Doctor to Patient Booking (Admin Only)' })
  async assignStaff(
    @Param('id') id: string,
    @Body() assignStaffDto: AssignStaffDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.bookingsService.assignStaff(id, assignStaffDto, {
      id: user.id,
      name: user.name,
      role: user.role as Role,
    });
  }
}
