import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ConvertToStaffDto {
  @ApiProperty({ example: 'Nurse@Welcome2026', description: 'Temporary password for the newly hired staff' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  temporaryPassword: string;
}

