import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

  findAll(projectId: number) {
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

  async create(projectId: number, title: string) {
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

  update(id: number, data: any) {
    return this.prisma.section.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.section.delete({
      where: { id },
    });
  }
}
