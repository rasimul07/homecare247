import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNurseProfileDto {
  @ApiPropertyOptional({ example: 'INC-RN-883719' })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiProperty({ example: 'B.Sc Nursing, Critical Care Certified' })
  @IsString()
  @IsNotEmpty()
  qualification: string;

  @ApiProperty({ example: 6 })
  @IsNumber()
  experienceYears: number;

  @ApiProperty({ example: 'ICU Care, Ventilator Support, Tracheostomy, Ryle tube, IV Infusion' })
  @IsString()
  @IsNotEmpty()
  skills: string;

  @ApiPropertyOptional({ example: '["Injections","Wound Dressing","Catheterization"]' })
  @IsString()
  @IsOptional()
  permittedClinicalTasks?: string;

  @ApiProperty({ example: 'kolkata' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: '12d', description: '12d, 12n, 24h' })
  @IsString()
  @IsOptional()
  shiftPreference?: string;

  @ApiPropertyOptional({ example: 'AVAILABLE', description: 'AVAILABLE, ON_DUTY, ON_LEAVE' })
  @IsString()
  @IsOptional()
  availabilityStatus?: string;
}

