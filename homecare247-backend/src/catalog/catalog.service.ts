import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEmergencyRequestDto } from './dto/create-emergency-request.dto.js';
import { InquiryStatus } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getServices(category?: string, isClinical?: boolean) {
    const services = await this.prisma.serviceItem.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
        ...(isClinical !== undefined ? { isClinical } : {}),
      },
      orderBy: { startingPrice: 'asc' },
    });

    return services.map((s) => ({
      ...s,
      keyFeatures: s.keyFeatures ? JSON.parse(s.keyFeatures) : [],
      clinicalProcedures: s.clinicalProcedures ? JSON.parse(s.clinicalProcedures) : [],
      nonClinicalScope: s.nonClinicalScope ? JSON.parse(s.nonClinicalScope) : [],
      exclusions: s.exclusions ? JSON.parse(s.exclusions) : [],
      popularFor: s.popularFor ? JSON.parse(s.popularFor) : [],
    }));
  }

  async getServiceById(id: string) {
    const service = await this.prisma.serviceItem.findUnique({
      where: { id },
    });

    if (!service) throw new NotFoundException('Service not found');

    return {
      ...service,
      keyFeatures: service.keyFeatures ? JSON.parse(service.keyFeatures) : [],
      clinicalProcedures: service.clinicalProcedures ? JSON.parse(service.clinicalProcedures) : [],
      nonClinicalScope: service.nonClinicalScope ? JSON.parse(service.nonClinicalScope) : [],
      exclusions: service.exclusions ? JSON.parse(service.exclusions) : [],
      popularFor: service.popularFor ? JSON.parse(service.popularFor) : [],
    };
  }

  async getCities() {
    const cities = await this.prisma.cityHub.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return cities.map((c) => ({
      ...c,
      popularAreas: c.popularAreas ? JSON.parse(c.popularAreas) : [],
      coveredPinCodes: c.coveredPinCodes ? JSON.parse(c.coveredPinCodes) : [],
    }));
  }

  async getCityById(id: string) {
    const city = await this.prisma.cityHub.findUnique({
      where: { id },
    });

    if (!city) throw new NotFoundException('City hub not found');

    return {
      ...city,
      popularAreas: city.popularAreas ? JSON.parse(city.popularAreas) : [],
      coveredPinCodes: city.coveredPinCodes ? JSON.parse(city.coveredPinCodes) : [],
    };
  }

  async createEmergencyRequest(dto: CreateEmergencyRequestDto) {
    return this.prisma.emergencyRequest.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        city: dto.city,
        area: dto.area,
        serviceNeeded: dto.serviceNeeded,
        message: dto.message,
        isUrgent: true,
        status: InquiryStatus.NEW,
      },
    });
  }
}
