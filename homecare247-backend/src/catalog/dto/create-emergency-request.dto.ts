import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEmergencyRequestDto {
  @ApiProperty({ example: 'Ramesh Sen' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+91 98300 11223' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'kolkata' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: 'Ballygunge' })
  @IsString()
  @IsOptional()
  area?: string;

  @ApiPropertyOptional({ example: 'Urgent ICU Nurse required for COPD exacerbation' })
  @IsString()
  @IsOptional()
  serviceNeeded?: string;

  @ApiPropertyOptional({ example: 'Patient on 4L Oxygen, saturation dropping to 90%' })
  @IsString()
  @IsOptional()
  message?: string;
}

