import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IncidentType, IncidentSeverity } from '@prisma/client';

export class CreateComplaintDto {
  @ApiPropertyOptional({ example: 'booking-uuid-1234', description: 'Associated booking ID' })
  @IsString()
  @IsOptional()
  bookingId?: string;

  @ApiProperty({
    enum: IncidentType,
    example: IncidentType.GENERAL_COMPLAINT,
    description: 'Type of complaint or incident',
  })
  @IsEnum(IncidentType)
  @IsNotEmpty()
  incidentType: IncidentType;

  @ApiPropertyOptional({
    enum: IncidentSeverity,
    example: IncidentSeverity.MEDIUM,
    description: 'Severity level: LOW, MEDIUM, HIGH, CRITICAL',
  })
  @IsEnum(IncidentSeverity)
  @IsOptional()
  severity?: IncidentSeverity;

  @ApiProperty({
    example: 'Assigned attendant arrived 45 minutes late without informing beforehand.',
    description: 'Detailed description of the issue',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'Patient waited for morning medication.' })
  @IsString()
  @IsOptional()
  patientConditionAtIncident?: string;
}
