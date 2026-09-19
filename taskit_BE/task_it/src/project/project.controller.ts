import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProjectService } from './project.service';
import { CreateProjectDto } from './project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  @Get()
  async getAllProjects() {
    return this.projectService.getAllProjects();
  }
  @Delete(':id')
  async deleteProject(@Param('id') id: number) {
    return this.projectService.deleteProject(id);
  }
  @Get(':slug')
  async getProjectBySlug(@Param('slug') slug: string) {
    return this.projectService.findByName(slug);
  }
}
