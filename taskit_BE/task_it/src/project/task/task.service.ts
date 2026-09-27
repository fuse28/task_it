import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectAccessService } from '../project-access.service';

const userSelect = { id: true, name: true, email: true };

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private projectAccess: ProjectAccessService,
  ) {}

  async findAll(stageId: number, userId: number) {
    await this.projectAccess.assertStageMember(userId, stageId);
    return this.prisma.task.findMany({
      where: { stageId },
      orderBy: { position: 'asc' },
      include: { assignees: { select: userSelect } },
    });
  }

  async findOne(id: number, userId: number) {
    await this.projectAccess.assertTaskMember(userId, id);
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignees: { select: userSelect },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: userSelect },
            mentions: { select: userSelect },
          },
        },
      },
    });
  }

  async create(
    stageId: number,
    title: string,
    description: string | undefined,
    userId: number,
  ) {
    await this.projectAccess.assertStageMember(userId, stageId);
    const count = await this.prisma.task.count({ where: { stageId } });

    return this.prisma.task.create({
      data: {
        stageId,
        title,
        description,
        position: count,
      },
    });
  }

  async update(
    id: number,
    data: { title?: string; description?: string; assigneeIds?: number[] },
    userId: number,
  ) {
    await this.projectAccess.assertTaskMember(userId, id);
    const { assigneeIds, ...rest } = data;

    return this.prisma.task.update({
      where: { id },
      data: {
        ...rest,
        ...(assigneeIds
          ? { assignees: { set: assigneeIds.map((memberId) => ({ id: memberId })) } }
          : {}),
      },
      include: { assignees: { select: userSelect } },
    });
  }

  async delete(id: number, userId: number) {
    await this.projectAccess.assertTaskMember(userId, id);
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
