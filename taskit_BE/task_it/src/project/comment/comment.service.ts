import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectAccessService } from '../project-access.service';

const userSelect = { id: true, name: true, email: true };

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private projectAccess: ProjectAccessService,
  ) {}

  async create(
    taskId: number,
    authorId: number,
    content: string,
    mentionedUserIds: number[] = [],
  ) {
    await this.projectAccess.assertTaskMember(authorId, taskId);
    return this.prisma.comment.create({
      data: {
        taskId,
        authorId,
        content,
        mentions: { connect: mentionedUserIds.map((id) => ({ id })) },
      },
      include: {
        author: { select: userSelect },
        mentions: { select: userSelect },
      },
    });
  }

  async update(
    id: number,
    userId: number,
    content: string,
    mentionedUserIds: number[] = [],
  ) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    return this.prisma.comment.update({
      where: { id },
      data: {
        content,
        mentions: { set: mentionedUserIds.map((mentionId) => ({ id: mentionId })) },
      },
      include: {
        author: { select: userSelect },
        mentions: { select: userSelect },
      },
    });
  }

  async delete(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({ where: { id } });
  }
}
