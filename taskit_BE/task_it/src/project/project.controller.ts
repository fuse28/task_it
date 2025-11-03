import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { ProjectService } from './project.service';
import { CreateProjectDto } from './project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('project')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  @Get('getAllProjects')
  async getAllProjects() {
    return this.projectService.getAllProjects();
  }
}
