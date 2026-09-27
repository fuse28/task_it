import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { ProjectAccessService } from './project-access.service';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private projectAccess: ProjectAccessService,
  ) {}

  async createProject(dto: CreateProjectDto, creatorId: number) {
    const existing = await this.prisma.project.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException(`Project "${dto.name}" already exists`);
    }

    const teamMemberIds = Array.from(
      new Set([...(dto.teamMemberIds ?? []), creatorId]),
    );

    const users = await this.prisma.user.findMany({
      where: { id: { in: teamMemberIds } },
      select: { id: true },
    });

    if (users.length !== teamMemberIds.length) {
      throw new NotFoundException('One or more team members not found');
    }

    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description || null,
        team: { connect: teamMemberIds.map((id) => ({ id })) },
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

  getAllProjects(userId: number) {
    return this.prisma.project.findMany({
      where: { team: { some: { id: userId } } },
      include: {
        team: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async deleteProject(id: number, userId: number) {
    await this.projectAccess.assertProjectMember(userId, id);
    return this.prisma.project.delete({
      where: { id },
    });
  }

  async updateProject(id: number, dto: UpdateProjectDto, userId: number) {
    await this.projectAccess.assertProjectMember(userId, id);
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    if (dto.name && dto.name !== project.name) {
      const existing = await this.prisma.project.findUnique({
        where: { name: dto.name },
      });
      if (existing) {
        throw new BadRequestException(`Project "${dto.name}" already exists`);
      }
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
      },
      include: {
        team: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findByName(projectName: string, userId: number) {
    const decodedName = projectName.replace(/-/g, ' ');
    const project = await this.prisma.project.findFirst({
      where: {
        name: { equals: decodedName, mode: 'insensitive' },
        team: { some: { id: userId } },
      },
      include: {
        team: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    if (!project) {
      throw new NotFoundException(`Project "${decodedName}" not found`);
    }
    return project;
  }
}
