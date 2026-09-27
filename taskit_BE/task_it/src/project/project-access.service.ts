import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectAccessService {
  constructor(private prisma: PrismaService) {}

  async assertProjectMember(userId: number, projectId: number) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, team: { some: { id: userId } } },
      select: { id: true },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
  }

  async assertSectionMember(userId: number, sectionId: number) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      select: { projectId: true },
    });
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    await this.assertProjectMember(userId, section.projectId);
  }

  async assertStageMember(userId: number, stageId: number) {
    const stage = await this.prisma.stage.findUnique({
      where: { id: stageId },
      select: { section: { select: { projectId: true } } },
    });
    if (!stage) {
      throw new NotFoundException('Stage not found');
    }
    await this.assertProjectMember(userId, stage.section.projectId);
  }

  async assertTaskMember(userId: number, taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { stage: { select: { section: { select: { projectId: true } } } } },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.assertProjectMember(userId, task.stage.section.projectId);
  }

  async assertCommentTaskMember(userId: number, commentId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { taskId: true },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.assertTaskMember(userId, comment.taskId);
  }

  async assertFlowDiagramMember(userId: number, flowDiagramId: number) {
    const diagram = await this.prisma.flowDiagram.findUnique({
      where: { id: flowDiagramId },
      select: { projectId: true },
    });
    if (!diagram) {
      throw new NotFoundException('Flow diagram not found');
    }
    await this.assertProjectMember(userId, diagram.projectId);
  }
}
