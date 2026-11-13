import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RecordVitalsDto {
  @ApiProperty({ example: 'booking-uuid-1234', description: 'Patient Booking ID' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiPropertyOptional({ example: '120/80', description: 'Blood Pressure in mmHg' })
  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @ApiPropertyOptional({ example: 76, description: 'Heart Rate in beats per min' })
  @IsNumber()
  @IsOptional()
  heartRate?: number;

  @ApiPropertyOptional({ example: 98.5, description: 'Oxygen Saturation SpO2 (%)' })
  @IsNumber()
  @IsOptional()
  spO2?: number;

  @ApiPropertyOptional({ example: 98.6, description: 'Body Temperature in Fahrenheit' })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @ApiPropertyOptional({ example: 18, description: 'Respiratory Rate per min' })
  @IsNumber()
  @IsOptional()
  respiratoryRate?: number;

  @ApiPropertyOptional({ example: '118 mg/dL (Post-lunch)', description: 'Blood Sugar' })
  @IsString()
  @IsOptional()
  bloodSugar?: string;

  @ApiProperty({
    example: 'Wound dressing changed under aseptic conditions. Surgical site dry and healthy. Patient ambulated 15 mins in room with support.',
    description: 'Nurse clinical observations and nursing actions executed',
  })
  @IsString()
  @IsNotEmpty()
  clinicalNotes: string;

  @ApiPropertyOptional({
    example: 'Inj Clexane 40mg s/c given at 10:00 AM, Tab Ecosprin 75mg given post-lunch',
    description: 'Medicines given during shift',
  })
  @IsString()
  @IsOptional()
  medicationAdministered?: string;
}

