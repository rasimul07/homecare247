import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckInDto {
  @ApiPropertyOptional({
    example: 'Arrived at patient residence. Patient conscious, oriented, resting in bed. Handover received from day attendant.',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

