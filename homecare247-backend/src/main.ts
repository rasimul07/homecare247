import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Ensure uploads directory exists
  const uploadDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
  const resumesDir = join(uploadDir, 'resumes');
  if (!existsSync(resumesDir)) {
    mkdirSync(resumesDir, { recursive: true });
  }

  // Serve uploaded files statically
  app.useStaticAssets(uploadDir, {
    prefix: '/uploads/',
  });

  // Global API Prefix
  app.setGlobalPrefix('api');

  // CORS Configuration
  const frontendOrigins = process.env.FRONTEND_ORIGINS
    ? process.env.FRONTEND_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || frontendOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Interceptor and Filter
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HomeCare247 Unified Healthcare Platform API')
    .setDescription(
      'Complete Home Healthcare & Nursing Care Agency Operations API compliant with West Bengal Clinical & Non-Clinical Care Guidelines (WBNC, DPDP Act 2023, GST SAC 9993/9985).',
    )
    .setVersion('2.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT access token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'Universal Login & Session Management for Admin, Doctors, Nurses, Caregivers & Customers')
    .addTag('Customer & Family Dashboard', 'Patient Profiles, Booking History, Live Staff Tracking, Care Reports & Invoices')
    .addTag('Patient Bookings & Clinical Inquiries', 'Online booking intake with 8-step workflow, PIN codes and consent')
    .addTag('Admin Operations & Control Center', 'Real-time KPIs, Automated Staff Matching, Incident Register, Financial Reports & Audit Log')
    .addTag('Nurse & Clinical Staff Portal', 'Job Requests (Accept/Reject), En Route, Check-in/out, Bedside Vitals & Incident Reports')
    .addTag('Doctor Portal', 'Clinical notes, vitals review, and patient supervision')
    .addTag('Nurse & Staff Careers / Hiring Portal', 'Nurse resume uploads, CV review, and one-click hiring')
    .addTag('Users & Medical Personnel', 'Doctor and nurse directory, credentials and profiles')
    .addTag('Public Services & City Hubs (Landing Page)', 'Public service specifications, clinical scope distinction, and city hubs')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'HomeCare247 API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      displayRequestDuration: true,
    },
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`========================================================`);
  logger.log(`🏥 HomeCare247 Backend running on: http://localhost:${port}`);
  logger.log(`📚 Swagger API Documentation:       http://localhost:${port}/api/docs`);
  logger.log(`========================================================`);
}

bootstrap();
