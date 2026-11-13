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
import { AdminService } from './admin.service.js';
import { CreateShiftDto } from './dto/create-shift.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator.js';
import { ShiftStatus, InquiryStatus, IncidentStatus, Role } from '@prisma/client';

@ApiTags('Admin Operations & Control Center')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @ApiOperation({
    summary: 'Executive Admin Dashboard: Real-time KPIs, active duties, bookings, applications',
  })
  async getMetrics() {
    return this.adminService.getMetrics();
  }

  @Get('bookings/:id/recommend-staff')
  @ApiOperation({
    summary: 'Automated Staff Matching Engine (PDF Page 6 - Section D)',
    description: 'Recommends available staff based on service division (Clinical vs Non-Clinical), qualification, PIN code/area match, schedule conflicts, and rating.',
  })
  async recommendStaffForBooking(@Param('id') bookingId: string) {
    return this.adminService.recommendStaffForBooking(bookingId);
  }

  @Post('bookings/:id/dispatch-offer')
  @ApiOperation({
    summary: 'Dispatch Job Offer to Candidate Worker (Awaiting Worker Acceptance)',
  })
  async dispatchJobOffer(
    @Param('id') bookingId: string,
    @Body('workerId') workerId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.adminService.dispatchJobOffer(bookingId, workerId, {
      id: user.id,
      name: user.name,
    });
  }

  @Post('shifts')
  @ApiOperation({
    summary: 'Schedule Shift: Assign nurse/staff member to patient booking',
  })
  async createShift(@Body() dto: CreateShiftDto) {
    return this.adminService.createShift(dto);
  }

  @Get('shifts')
  @ApiOperation({ summary: 'List all operational shifts across all cities' })
  @ApiQuery({ name: 'bookingId', type: String, required: false })
  @ApiQuery({ name: 'staffId', type: String, required: false })
  @ApiQuery({ name: 'shiftDate', type: String, required: false })
  @ApiQuery({ name: 'status', enum: ShiftStatus, required: false })
  async getAllShifts(
    @Query('bookingId') bookingId?: string,
    @Query('staffId') staffId?: string,
    @Query('shiftDate') shiftDate?: string,
    @Query('status') status?: ShiftStatus,
  ) {
    return this.adminService.getAllShifts({ bookingId, staffId, shiftDate, status });
  }

  @Get('incidents')
  @ApiOperation({ summary: 'View Complaints & Incident Register (PDF Page 6 & 7)' })
  @ApiQuery({ name: 'status', enum: IncidentStatus, required: false })
  async getIncidents(@Query('status') status?: IncidentStatus) {
    return this.adminService.getIncidents(status);
  }

  @Patch('incidents/:id')
  @ApiOperation({ summary: 'Update incident investigation notes, replacement worker, or resolution' })
  async updateIncident(
    @Param('id') id: string,
    @Body()
    dto: {
      status: IncidentStatus;
      investigationNotes?: string;
      resolutionNotes?: string;
      replacementWorkerId?: string;
    },
  ) {
    return this.adminService.updateIncident(id, dto);
  }

  @Get('finances')
  @ApiOperation({
    summary: 'Payment & Finance Management: Invoices, unit economics, worker payouts, and GST breakdown',
  })
  async getFinancialReports() {
    return this.adminService.getFinancialReports();
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Full activity log showing who changed a booking and when (PDF Page 6)' })
  @ApiQuery({ name: 'bookingId', type: String, required: false })
  async getAuditLogs(@Query('bookingId') bookingId?: string) {
    return this.adminService.getAuditLogs(bookingId);
  }

  @Get('emergency-requests')
  @ApiOperation({ summary: 'View urgent callback and emergency requests from landing page' })
  @ApiQuery({ name: 'status', enum: InquiryStatus, required: false })
  async getEmergencyRequests(@Query('status') status?: InquiryStatus) {
    return this.adminService.getEmergencyRequests(status);
  }

  @Patch('emergency-requests/:id')
  @ApiOperation({ summary: 'Update status of emergency request (CONTACTED, RESOLVED)' })
  async updateEmergencyRequest(
    @Param('id') id: string,
    @Body('status') status: InquiryStatus,
  ) {
    return this.adminService.updateEmergencyRequest(id, status);
  }
}
