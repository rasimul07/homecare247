import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDoctorProfileDto {
  @ApiProperty({ example: 'Critical Care & Pulmonology' })
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @ApiProperty({ example: 'WB-MED-482910' })
  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty({ example: 'MBBS, MD (Internal Medicine), FNB (Critical Care)' })
  @IsString()
  @IsNotEmpty()
  qualification: string;

  @ApiProperty({ example: 12 })
  @IsNumber()
  experienceYears: number;

  @ApiProperty({ example: 'kolkata' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: 'Mon-Sat (9:00 AM - 6:00 PM)' })
  @IsString()
  @IsOptional()
  availableDays?: string;

  @ApiPropertyOptional({ example: 1200 })
  @IsNumber()
  @IsOptional()
  consultationFee?: number;

  @ApiPropertyOptional({ example: 'Senior Critical Care & Home ICU Consultant' })
  @IsString()
  @IsOptional()
  bio?: string;
}

