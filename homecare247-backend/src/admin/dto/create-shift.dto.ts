import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShiftDto {
  @ApiProperty({ example: 'booking-uuid-1234', description: 'Patient Booking ID' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ example: 'nurse-uuid-5678', description: 'Staff / Nurse User ID' })
  @IsString()
  @IsNotEmpty()
  staffId: string;

  @ApiProperty({ example: '2026-11-15', description: 'Shift Date (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  shiftDate: string;

  @ApiProperty({ example: 'DAY_12H', description: 'DAY_12H, NIGHT_12H, FULL_24H, VISIT_2H' })
  @IsString()
  @IsNotEmpty()
  shiftType: string;

  @ApiProperty({ example: '08:00 AM', description: 'Start time' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '08:00 PM', description: 'End time' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiPropertyOptional({ example: 'Admin dispatch note: Bring sterile dressing pack and tracheostomy care kit.' })
  @IsString()
  @IsOptional()
  notes?: string;
}

