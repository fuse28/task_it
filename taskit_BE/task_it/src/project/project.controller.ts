import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req,
  ) {
    return this.projectService.createProject(createProjectDto, req.user.id);
  }

  @Get()
  async getAllProjects(@Request() req) {
    return this.projectService.getAllProjects(req.user.id);
  }
  @Delete(':id')
  async deleteProject(@Param('id') id: string, @Request() req) {
    return this.projectService.deleteProject(Number(id), req.user.id);
  }
  @Put(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @Request() req,
  ) {
    return this.projectService.updateProject(Number(id), dto, req.user.id);
  }
  @Get(':slug')
  async getProjectBySlug(@Param('slug') slug: string, @Request() req) {
    return this.projectService.findByName(slug, req.user.id);
  }
}
