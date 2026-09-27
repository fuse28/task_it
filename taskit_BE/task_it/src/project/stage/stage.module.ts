import { Module } from '@nestjs/common';
import { StageService } from './stage.service';
import { StageController } from './stage.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectAccessModule } from '../project-access.module';

@Module({
  imports: [ProjectAccessModule],
  controllers: [StageController],
  providers: [StageService, PrismaService],
})
export class StageModule {}
