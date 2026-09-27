import { Module } from '@nestjs/common';
import { FlowDiagramService } from './flow-diagram.service';
import { FlowDiagramController } from './flow-diagram.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectAccessModule } from '../project-access.module';

@Module({
  imports: [ProjectAccessModule],
  controllers: [FlowDiagramController],
  providers: [FlowDiagramService, PrismaService],
})
export class FlowDiagramModule {}
