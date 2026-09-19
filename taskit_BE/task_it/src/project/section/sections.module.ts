import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SectionController],
  providers: [SectionService, PrismaService],
})
export class SectionModule {}
