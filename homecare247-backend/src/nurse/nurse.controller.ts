import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NurseService } from './nurse.service.js';
import { CheckInDto } from './dto/check-in.dto.js';
import { CheckOutDto } from './dto/check-out.dto.js';
import { RecordVitalsDto } from './dto/record-vitals.dto.js';
import { UpdateAvailabilityDto } from './dto/update-availability.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator.js';
import { Role, IncidentType, IncidentSeverity } from '@prisma/client';

@ApiTags('Nurse & Clinical Staff Portal')
@ApiBearerAuth('JWT-auth')
@UseGuards(RolesGuard)
@Roles(Role.NURSE, Role.CAREGIVER, Role.STAFF, Role.ADMIN)
@Controller('nurse')
export class NurseController {
  constructor(private readonly nurseService: NurseService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Nurse Dashboard: Incoming job requests, active shift, assigned patients & schedule',
  })
  async getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.nurseService.getDashboard(user.id);
  }

  @Post('job-offers/:id/respond')
  @ApiOperation({
    summary: 'Accept or Reject Job Request (PDF Page 6 - Nurse / Caregiver Portal)',
    description: 'Worker can review shift duration, location, patient needs and accept or decline without penalty.',
  })
  async respondToJobOffer(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') offerId: string,
    @Body('accept') accept: boolean,
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    return this.nurseService.respondToJobOffer(user.id, offerId, accept, rejectionReason);
  }

  @Post('shifts/:id/en-route')
  @ApiOperation({
    summary: 'En Route: Worker marks journey started ("Staff on the way") for patient live tracking',
  })
  async setEnRoute(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') shiftId: string,
  ) {
    return this.nurseService.setEnRoute(user.id, shiftId);
  }

  @Post('shifts/:id/check-in')
  @ApiOperation({
    summary: 'Clock-In: Nurse confirms arrival at patient home and starts duty',
  })
  async checkIn(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') shiftId: string,
    @Body() dto: CheckInDto,
  ) {
    return this.nurseService.checkIn(user.id, shiftId, dto);
  }

  @Post('shifts/:id/check-out')
  @ApiOperation({
    summary: 'Clock-Out: Nurse concludes shift, submits vital summary & hands over care',
  })
  async checkOut(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') shiftId: string,
    @Body() dto: CheckOutDto,
  ) {
    return this.nurseService.checkOut(user.id, shiftId, dto);
  }

  @Post('vitals')
  @ApiOperation({
    summary: 'Bedside Vitals & Nursing Chart: Log BP, SpO2, Pulse, Temp, Sugar & procedures',
  })
  async recordVitals(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RecordVitalsDto,
  ) {
    return this.nurseService.recordVitals(user.id, user.name, dto);
  }

  @Post('incidents')
  @ApiOperation({
    summary: 'Report Incident, Safety Concern, Patient Deterioration, or Inability to Continue (PDF Page 7)',
  })
  async reportIncident(
    @CurrentUser() user: AuthenticatedUser,
    @Body()
    dto: {
      bookingId?: string;
      incidentType: IncidentType;
      severity?: IncidentSeverity;
      description: string;
      escalatedToEmergency?: boolean;
    },
  ) {
    return this.nurseService.reportIncident(user.id, dto);
  }

  @Get('shifts')
  @ApiOperation({ summary: 'List all shifts allocated to this nurse/staff' })
  async getShifts(@CurrentUser() user: AuthenticatedUser) {
    return this.nurseService.getShifts(user.id);
  }

  @Get('payouts')
  @ApiOperation({ summary: 'View attendance, completed shift count, and payout history' })
  async getPayoutHistory(@CurrentUser() user: AuthenticatedUser) {
    return this.nurseService.getPayoutHistory(user.id);
  }

  @Patch('availability')
  @ApiOperation({
    summary: 'Toggle Worker Availability Status (AVAILABLE, ON_DUTY, ON_LEAVE)',
  })
  async updateAvailability(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.nurseService.updateAvailability(user.id, dto);
  }
}
