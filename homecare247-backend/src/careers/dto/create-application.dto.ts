import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateApplicationDto {
  @ApiProperty({ example: 'Sushmita Mukherjee', description: 'Applicant Full Name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'sushmita.nurse@gmail.com', description: 'Applicant Email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+91 98311 55443', description: 'Applicant Phone Number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'Critical Care ICU Nurse',
    description: 'Role applying for (e.g. Critical Care ICU Nurse, General Duty Nurse, Elder Care Attendant, Physiotherapist)',
  })
  @IsString()
  @IsNotEmpty()
  roleApplied: string;

  @ApiProperty({ example: 'B.Sc Nursing (WBNC Registered)', description: 'Educational & Nursing Qualification' })
  @IsString()
  @IsNotEmpty()
  qualification: string;

  @ApiProperty({ example: 5, description: 'Years of clinical experience' })
  @Transform(({ value }) => parseInt(value, 10))
  experienceYears: number;

  @ApiProperty({ example: 'Kolkata', description: 'Current Residence City' })
  @IsString()
  @IsNotEmpty()
  currentCity: string;

  @ApiProperty({ example: 'Kolkata', description: 'Preferred Working City' })
  @IsString()
  @IsNotEmpty()
  preferredCity: string;

  @ApiPropertyOptional({ example: true, description: 'Available to join immediately' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  availableImmediate?: boolean;

  @ApiPropertyOptional({
    example: 'Ventilator management, Tracheostomy, BiPAP, Infusion pumps, Arterial line, Wound care',
    description: 'Clinical competencies & skills',
  })
  @IsString()
  @IsOptional()
  skills?: string;

  @ApiPropertyOptional({ example: '₹35,000 / month', description: 'Expected compensation' })
  @IsString()
  @IsOptional()
  expectedSalary?: string;

  @ApiPropertyOptional({ example: 'Worked 3 years in Apollo Gleneagles ICU and 2 years in Homecare', description: 'Additional background notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Direct Resume URL if uploaded to cloud/storage' })
  @IsString()
  @IsOptional()
  resumeUrl?: string;
}

