import { Module } from '@nestjs/common';
import { ProjectAccessService } from './project-access.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ProjectAccessService, PrismaService],
  exports: [ProjectAccessService],
})
export class ProjectAccessModule {}
