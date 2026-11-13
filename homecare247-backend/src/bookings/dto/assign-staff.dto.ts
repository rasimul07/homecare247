import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AssignStaffDto {
  @ApiPropertyOptional({ example: 'nurse-uuid-1234', description: 'Assigned Nurse User ID' })
  @IsString()
  @IsOptional()
  assignedNurseId?: string;

  @ApiPropertyOptional({ example: 'doctor-uuid-5678', description: 'Assigned Doctor User ID' })
  @IsString()
  @IsOptional()
  assignedDoctorId?: string;

  @ApiPropertyOptional({ example: 'Assigned by Admin dispatch coordinator' })
  @IsString()
  @IsOptional()
  notes?: string;
}

