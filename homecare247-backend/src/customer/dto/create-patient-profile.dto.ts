import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePatientProfileDto {
  @ApiProperty({ example: 'Smt. Maya Banerjee', description: 'Patient Full Name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 74, description: 'Patient Age' })
  @IsNumber()
  age: number;

  @ApiProperty({ example: 'Female', description: 'Gender: Male, Female, Other' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ example: 'Mother', description: 'Relationship to account holder: Mother, Father, Self, Spouse, Child, Other' })
  @IsString()
  @IsNotEmpty()
  relationship: string;

  @ApiPropertyOptional({ example: 'Type 2 Diabetes, Hypertension, Post-Stroke Left Hemiparesis' })
  @IsString()
  @IsOptional()
  primaryDiagnosis?: string;

  @ApiPropertyOptional({ example: 'Previous stroke 2024. Allergic to Penicillin. Regular insulin 14 units morning.' })
  @IsString()
  @IsOptional()
  medicalHistory?: string;

  @ApiPropertyOptional({ example: 'Discharged from Peerless Hospital on 10 Nov 2026. Advised chest physiotherapy and 12-hr nursing care.' })
  @IsString()
  @IsOptional()
  hospitalDischargeSummary?: string;

  @ApiPropertyOptional({ example: 'Wheelchair / Bedridden', description: 'Bedridden, Wheelchair, Assisted walking, Independent' })
  @IsString()
  @IsOptional()
  mobilityStatus?: string;

  @ApiProperty({ example: 'Subir Banerjee (Son)', description: 'Primary Emergency Contact Person' })
  @IsString()
  @IsNotEmpty()
  emergencyContactName: string;

  @ApiProperty({ example: '+91 98305 44321', description: 'Emergency Contact Phone' })
  @IsString()
  @IsNotEmpty()
  emergencyContactPhone: string;
}
