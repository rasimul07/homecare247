import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'priya.nurse@homecare247.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Nurse@Secure123', description: 'Password' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Sister Priya Sharma', description: 'Full Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '+91 98765 43210', description: 'Contact Phone Number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ enum: Role, default: Role.NURSE, description: 'Role assigned to user' })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional({ example: 'kolkata', description: 'City assignment' })
  @IsString()
  @IsOptional()
  city?: string;
}

