import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDoctorNoteDto {
  @ApiProperty({ example: 'booking-uuid-1234', description: 'Patient Booking ID' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({
    example: 'Patient chest sounds clear bilaterally. Surgical incision healing well without signs of erythema or discharge.',
    description: 'Clinical findings and patient progress notes',
  })
  @IsString()
  @IsNotEmpty()
  clinicalNotes: string;

  @ApiPropertyOptional({
    example: 'Continue Tab Telmisartan 40mg OD. Increase incentive spirometry to 10 repetitions Q2H. Monitor SpO2 and notify if below 94%.',
    description: 'Medical orders and guidelines for bedside nurse and patient family',
  })
  @IsString()
  @IsOptional()
  doctorRecommendations?: string;

  @ApiPropertyOptional({
    example: 'Tab Telmisartan 40mg, Tab Pan 40mg, Tab Limcee 500mg',
    description: 'Prescribed or adjusted medications',
  })
  @IsString()
  @IsOptional()
  medicationAdministered?: string;

  @ApiPropertyOptional({ example: '125/82' })
  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @ApiPropertyOptional({ example: 76 })
  @IsNumber()
  @IsOptional()
  heartRate?: number;

  @ApiPropertyOptional({ example: 98.5 })
  @IsNumber()
  @IsOptional()
  spO2?: number;

  @ApiPropertyOptional({ example: 98.4 })
  @IsNumber()
  @IsOptional()
  temperature?: number;
}

