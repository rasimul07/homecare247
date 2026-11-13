import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @ApiPropertyOptional({ example: 'customer-uuid-1234', description: 'Customer user ID if logged in' })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional({ example: 'patient-profile-uuid', description: 'Linked family patient profile ID' })
  @IsString()
  @IsOptional()
  patientProfileId?: string;

  @ApiProperty({ example: 'Smt. Maya Banerjee', description: 'Patient Full Name' })
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @ApiPropertyOptional({ example: 74, description: 'Patient Age' })
  @IsNumber()
  @IsOptional()
  patientAge?: number;

  @ApiPropertyOptional({ example: 'Female', description: 'Patient Gender: Male, Female, Other' })
  @IsString()
  @IsOptional()
  patientGender?: string;

  @ApiProperty({ example: 'Subir Banerjee (Son)', description: 'Contact Person Name' })
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @ApiProperty({ example: '+91 98305 44321', description: 'Contact Phone Number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'subir.banerjee@gmail.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'kolkata', description: 'City Hub ID' })
  @IsString()
  @IsNotEmpty()
  cityId: string;

  @ApiProperty({ example: 'Kolkata', description: 'City Name' })
  @IsString()
  @IsNotEmpty()
  cityName: string;

  @ApiProperty({ example: 'Baruipur', description: 'Locality or Area (e.g. Baruipur, Sonarpur, Garia, Jadavpur, Salt Lake)' })
  @IsString()
  @IsNotEmpty()
  area: string;

  @ApiPropertyOptional({ example: '700144', description: 'PIN Code of patient residence' })
  @IsString()
  @IsOptional()
  pinCode?: string;

  @ApiPropertyOptional({ example: 'Station Road, Ward 5, Holding 128' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'Near Baruipur Super Speciality Hospital' })
  @IsString()
  @IsOptional()
  landmark?: string;

  @ApiProperty({ example: 'skilled-nursing', description: 'Selected Service ID' })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ example: '24/7 Skilled Nursing Care', description: 'Service Name' })
  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @ApiPropertyOptional({ example: true, description: 'Whether this requires a licensed registered nurse' })
  @IsBoolean()
  @IsOptional()
  isClinical?: boolean;

  @ApiPropertyOptional({
    example: '12d',
    description: 'Shift Duration: 6h, 8h, 12d, 12n, 24h_rotating, 24h_livein, package_7d, package_15d, package_30d',
  })
  @IsString()
  @IsOptional()
  shiftDuration?: string;

  @ApiProperty({
    example: 'Post-stroke hemiparesis recovery, requires catheter care, vitals monitoring and assisted transfer',
    description: 'Patient medical condition / history',
  })
  @IsString()
  @IsNotEmpty()
  patientCondition: string;

  @ApiPropertyOptional({
    example: 'Discharged on 10-Nov-2026. Advised regular BP/SpO2 charting and physiotherapy.',
    description: 'Hospital discharge summary information',
  })
  @IsString()
  @IsOptional()
  hospitalDischargeInfo?: string;

  @ApiProperty({ example: '2026-11-15', description: 'Service Start Date (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({ example: '08:00 AM', description: 'Preferred start time' })
  @IsString()
  @IsOptional()
  preferredStartTime?: string;

  @ApiPropertyOptional({ example: '2026-11-30', description: 'Expected End Date' })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Please assign a Bengali-speaking experienced nurse' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: false, description: 'Whether this is an emergency booking' })
  @IsBoolean()
  @IsOptional()
  isEmergency?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Customer confirmed consent to healthcare data processing under DPDP Act 2023' })
  @IsBoolean()
  @IsOptional()
  consentAcknowledged?: boolean;
}
