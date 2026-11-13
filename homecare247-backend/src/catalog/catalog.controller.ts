import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CatalogService } from './catalog.service.js';
import { CreateEmergencyRequestDto } from './dto/create-emergency-request.dto.js';
import { Public } from '../common/decorators/public.decorator.js';

@ApiTags('Public Services & City Hubs (Landing Page)')
@Public()
@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('services')
  @ApiOperation({
    summary: 'List homecare services with clinical scope distinction & pricing (PDF Page 3 & 4)',
  })
  @ApiQuery({ name: 'category', type: String, required: false })
  @ApiQuery({ name: 'isClinical', type: Boolean, required: false, description: 'Filter clinical nursing vs non-clinical caregiver services' })
  async getServices(
    @Query('category') category?: string,
    @Query('isClinical') isClinical?: boolean,
  ) {
    return this.catalogService.getServices(category, isClinical);
  }

  @Get('services/:id')
  @ApiOperation({ summary: 'Get specific service specifications, clinical procedures, and exclusions' })
  async getServiceById(@Param('id') id: string) {
    return this.catalogService.getServiceById(id);
  }

  @Get('cities')
  @ApiOperation({
    summary: 'List active city hubs, covered PIN codes, response times, and pilot coverage',
  })
  async getCities() {
    return this.catalogService.getCities();
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Get single city hub details' })
  async getCityById(@Param('id') id: string) {
    return this.catalogService.getCityById(id);
  }

  @Post('emergency')
  @ApiOperation({
    summary: 'Submit Urgent 24/7 Emergency Dispatch / Call Request',
    description: 'Direct alert from landing page emergency banner for immediate coordinator call.',
  })
  async createEmergencyRequest(@Body() dto: CreateEmergencyRequestDto) {
    return this.catalogService.createEmergencyRequest(dto);
  }
}
