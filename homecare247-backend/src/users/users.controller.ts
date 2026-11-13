import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto.js';
import { CreateNurseProfileDto } from './dto/create-nurse-profile.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Role } from '@prisma/client';

@ApiTags('Users & Medical Personnel')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List all users with optional role & city filter (Admin only)' })
  @ApiQuery({ name: 'role', enum: Role, required: false })
  @ApiQuery({ name: 'city', type: String, required: false })
  async findAll(@Query('role') role?: Role, @Query('city') city?: string) {
    return this.usersService.findAll(role, city);
  }

  @Get('doctors')
  @ApiOperation({ summary: 'List all verified doctors (for assignment & telemedicine)' })
  @ApiQuery({ name: 'city', type: String, required: false })
  async findDoctors(@Query('city') city?: string) {
    return this.usersService.findDoctors(city);
  }

  @Get('nurses')
  @ApiOperation({ summary: 'List verified nurses & staff (for shift scheduling)' })
  @ApiQuery({ name: 'city', type: String, required: false })
  @ApiQuery({ name: 'status', type: String, required: false, description: 'AVAILABLE, ON_DUTY, ON_LEAVE' })
  async findNurses(
    @Query('city') city?: string,
    @Query('status') status?: string,
  ) {
    return this.usersService.findNurses(city, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post(':id/doctor-profile')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @ApiOperation({ summary: 'Set or update Doctor medical credentials & consultation info' })
  async upsertDoctorProfile(
    @Param('id') id: string,
    @Body() dto: CreateDoctorProfileDto,
  ) {
    return this.usersService.upsertDoctorProfile(id, dto);
  }

  @Post(':id/nurse-profile')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.NURSE)
  @ApiOperation({ summary: 'Set or update Nurse clinical skills & availability' })
  async upsertNurseProfile(
    @Param('id') id: string,
    @Body() dto: CreateNurseProfileDto,
  ) {
    return this.usersService.upsertNurseProfile(id, dto);
  }
}

