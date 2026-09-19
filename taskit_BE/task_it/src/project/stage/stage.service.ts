import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StageService {
  constructor(private prisma: PrismaService) {}

  findAll(sectionId: number) {
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

  async create(sectionId: number, title: string) {
    const count = await this.prisma.stage.count({ where: { sectionId } });

    return this.prisma.stage.create({
      data: {
        sectionId,
        title,
        position: count,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.stage.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.stage.delete({
      where: { id },
    });
  }
}
