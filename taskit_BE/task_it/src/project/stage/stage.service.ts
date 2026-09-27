import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectAccessService } from '../project-access.service';

@Injectable()
export class StageService {
  constructor(
    private prisma: PrismaService,
    private projectAccess: ProjectAccessService,
  ) {}

  async findAll(sectionId: number, userId: number) {
    await this.projectAccess.assertSectionMember(userId, sectionId);
    return this.prisma.stage.findMany({
      where: { sectionId },
      orderBy: { position: 'asc' },
      include: {
        tasks: {
          orderBy: { position: 'asc' },
          include: { assignees: { select: { id: true, name: true, email: true } } },
        },
      },
    });
  }

  async create(sectionId: number, title: string, userId: number) {
    await this.projectAccess.assertSectionMember(userId, sectionId);
    const count = await this.prisma.stage.count({ where: { sectionId } });

    return this.prisma.stage.create({
      data: {
        sectionId,
        title,
        position: count,
      },
    });
  }

  async update(id: number, data: any, userId: number) {
    await this.projectAccess.assertStageMember(userId, id);
    return this.prisma.stage.update({
      where: { id },
      data,
    });
  }

  async delete(id: number, userId: number) {
    await this.projectAccess.assertStageMember(userId, id);
    return this.prisma.stage.delete({
      where: { id },
    });
  }
}
