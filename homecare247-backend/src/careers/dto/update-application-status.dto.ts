import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    enum: ApplicationStatus,
    example: ApplicationStatus.SHORTLISTED,
    description: 'Application hiring pipeline stage',
  })
  @IsEnum(ApplicationStatus)
  @IsNotEmpty()
  status: ApplicationStatus;

  @ApiPropertyOptional({
    example: 'Profile verified. 5 years ICU background confirmed with Apollo credentials. Called for round 1 interview.',
    description: 'HR / Clinical Manager review notes',
  })
  @IsString()
  @IsOptional()
  reviewNotes?: string;

  @ApiPropertyOptional({
    example: '2026-11-20T11:00:00Z',
    description: 'Scheduled interview date & time (ISO string)',
  })
  @IsString()
  @IsOptional()
  interviewDate?: string;
}

