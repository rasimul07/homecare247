import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerService } from './customer.service.js';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto.js';
import { CreateComplaintDto } from './dto/create-complaint.dto.js';
import { CreateFeedbackDto } from './dto/create-feedback.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator.js';
import { Role } from '@prisma/client';

@ApiTags('Customer & Family Dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
@Roles(Role.CUSTOMER, Role.ADMIN)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Customer Dashboard: Active services, assigned verified staff, care notes, invoices',
  })
  async getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.customerService.getDashboard(user.id);
  }

  @Get('patients')
  @ApiOperation({ summary: 'List family patient profiles created under customer account' })
  async getPatientProfiles(@CurrentUser() user: AuthenticatedUser) {
    return this.customerService.getPatientProfiles(user.id);
  }

  @Post('patients')
  @ApiOperation({ summary: 'Create new patient profile for family member (Father, Mother, etc.)' })
  async createPatientProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePatientProfileDto,
  ) {
    return this.customerService.createPatientProfile(user.id, dto);
  }

  @Post('bookings/:id/cancel')
  @ApiOperation({ summary: 'Request booking cancellation or rescheduling with reason' })
  async cancelBooking(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') bookingId: string,
    @Body('reason') reason: string,
  ) {
    return this.customerService.cancelBooking(user.id, bookingId, reason || 'Customer requested');
  }

  @Post('complaints')
  @ApiOperation({ summary: 'Raise complaint or safety incident report' })
  async submitComplaint(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateComplaintDto,
  ) {
    return this.customerService.submitComplaint(user.id, dto);
  }

  @Post('feedback')
  @ApiOperation({ summary: 'Submit rating and performance feedback for assigned staff' })
  async submitFeedback(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateFeedbackDto,
  ) {
    return this.customerService.submitFeedback(user.id, dto);
  }
}
