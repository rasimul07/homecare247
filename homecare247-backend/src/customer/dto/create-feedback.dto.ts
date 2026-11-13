import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ example: 'booking-uuid-1234' })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Sister Priya was extremely attentive, disciplined, and gentle with my mother.',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  wouldRecommend?: boolean;
}
