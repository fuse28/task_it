import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const userSelect = { id: true, name: true, email: true };

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  findAll(stageId: number) {
    return this.prisma.task.findMany({
      where: { stageId },
      orderBy: { position: 'asc' },
      include: { assignees: { select: userSelect } },
    });
  }

  findOne(id: number) {
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

  async create(stageId: number, title: string, description?: string) {
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

  update(
    id: number,
    data: { title?: string; description?: string; assigneeIds?: number[] },
  ) {
    const { assigneeIds, ...rest } = data;

    return this.prisma.task.update({
      where: { id },
      data: {
        ...rest,
        ...(assigneeIds
          ? { assignees: { set: assigneeIds.map((userId) => ({ id: userId })) } }
          : {}),
      },
      include: { assignees: { select: userSelect } },
    });
  }

  delete(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
