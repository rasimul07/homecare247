import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAvailabilityDto {
  @ApiProperty({
    example: 'AVAILABLE',
    description: 'Nurse availability status: AVAILABLE, ON_DUTY, ON_LEAVE',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['AVAILABLE', 'ON_DUTY', 'ON_LEAVE'])
  availabilityStatus: string;
}

