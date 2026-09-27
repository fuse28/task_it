import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectAccessModule } from '../project-access.module';

@Module({
  imports: [ProjectAccessModule],
  controllers: [SectionController],
  providers: [SectionService, PrismaService],
})
export class SectionModule {}
