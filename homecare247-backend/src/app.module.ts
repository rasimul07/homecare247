import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { CareersModule } from './careers/careers.module.js';
import { DoctorModule } from './doctor/doctor.module.js';
import { NurseModule } from './nurse/nurse.module.js';
import { AdminModule } from './admin/admin.module.js';
import { CatalogModule } from './catalog/catalog.module.js';
import { CustomerModule } from './customer/customer.module.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BookingsModule,
    CareersModule,
    DoctorModule,
    NurseModule,
    AdminModule,
    CatalogModule,
    CustomerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
