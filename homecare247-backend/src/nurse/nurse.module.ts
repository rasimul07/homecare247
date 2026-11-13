import { Module } from '@nestjs/common';
import { NurseService } from './nurse.service.js';
import { NurseController } from './nurse.controller.js';

@Module({
  controllers: [NurseController],
  providers: [NurseService],
  exports: [NurseService],
})
export class NurseModule {}

