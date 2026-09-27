import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectAccessService } from '../project-access.service';
import { CreateFlowDiagramDto, UpdateFlowDiagramDto } from './flow-diagram.dto';

@Injectable()
export class FlowDiagramService {
  constructor(
    private prisma: PrismaService,
    private projectAccess: ProjectAccessService,
  ) {}

  async findAllForProject(projectId: number, userId: number) {
    await this.projectAccess.assertProjectMember(userId, projectId);
    return this.prisma.flowDiagram.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    await this.projectAccess.assertFlowDiagramMember(userId, id);
    return this.prisma.flowDiagram.findUnique({ where: { id } });
  }

  async create(dto: CreateFlowDiagramDto, userId: number) {
    await this.projectAccess.assertProjectMember(userId, dto.projectId);
    return this.prisma.flowDiagram.create({
      data: { projectId: dto.projectId, name: dto.name },
    });
  }

  async update(id: number, dto: UpdateFlowDiagramDto, userId: number) {
    await this.projectAccess.assertFlowDiagramMember(userId, id);
    return this.prisma.flowDiagram.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.data !== undefined ? { data: dto.data } : {}),
      },
    });
  }

  async delete(id: number, userId: number) {
    await this.projectAccess.assertFlowDiagramMember(userId, id);
    return this.prisma.flowDiagram.delete({ where: { id } });
  }
}
