import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectAccessService } from '../project-access.service';

@Injectable()
export class SectionService {
  constructor(
    private prisma: PrismaService,
    private projectAccess: ProjectAccessService,
  ) {}

  async findAll(projectId: number, userId: number) {
    await this.projectAccess.assertProjectMember(userId, projectId);
    return this.prisma.section.findMany({
      where: { projectId },
      orderBy: { position: 'asc' },
      include: {
        stages: {
          orderBy: { position: 'asc' },
          include: {
            tasks: {
              orderBy: { position: 'asc' },
              include: { assignees: { select: { id: true, name: true, email: true } } },
            },
          },
        },
      },
    });
  }

  async create(projectId: number, title: string, userId: number) {
    await this.projectAccess.assertProjectMember(userId, projectId);
    const count = await this.prisma.section.count({
      where: { projectId },
    });

    return this.prisma.section.create({
      data: {
        title,
        projectId,
        position: count,
      },
    });
  }

  async update(id: number, data: any, userId: number) {
    await this.projectAccess.assertSectionMember(userId, id);
    return this.prisma.section.update({
      where: { id },
      data,
    });
  }

  async delete(id: number, userId: number) {
    await this.projectAccess.assertSectionMember(userId, id);
    return this.prisma.section.delete({
      where: { id },
    });
  }
}
