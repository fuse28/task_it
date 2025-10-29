import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async createProject(dto: CreateProjectDto) {
    const existing = await this.prisma.project.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException(`Project "${dto.name}" already exists`);
    }

    if (dto.teamMemberIds && dto.teamMemberIds.length > 0) {
      const users = await this.prisma.user.findMany({
        where: { id: { in: dto.teamMemberIds } },
        select: { id: true },
      });

      if (users.length !== dto.teamMemberIds.length) {
        throw new NotFoundException('One or more team members not found');
      }
    }

    // 3️⃣ Create the project
    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description || null,
        team: dto.teamMemberIds
          ? {
              connect: dto.teamMemberIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        team: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return {
      message: 'Project created successfully',
      project,
    };
  }
}
