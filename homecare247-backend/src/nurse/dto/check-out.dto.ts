import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckOutDto {
  @ApiPropertyOptional({
    example: 'Shift ended smoothly. All oral medicines administered on time. Evening vitals stable. Patient handed over to family member Debashis Ghosh.',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    example: 'BP 122/80, SpO2 98% on room air, Pulse 74 bpm, Temp 98.4 F',
  })
  @IsString()
  @IsOptional()
  patientVitalsSummary?: string;
}

