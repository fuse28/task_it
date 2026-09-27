import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sections')
export class SectionController {
  constructor(private sectionService: SectionService) {}

  @Get('project/:projectId')
  findAll(@Param('projectId') projectId: string, @Request() req) {
    return this.sectionService.findAll(Number(projectId), req.user.id);
  }

  @Post('project/:projectId')
  create(
    @Param('projectId') projectId: string,
    @Body('title') title: string,
    @Request() req,
  ) {
    return this.sectionService.create(Number(projectId), title, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.sectionService.update(Number(id), data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.sectionService.delete(Number(id), req.user.id);
  }
}
