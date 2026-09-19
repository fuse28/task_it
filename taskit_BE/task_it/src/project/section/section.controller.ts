import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SectionService } from './section.service';

@Controller('sections')
export class SectionController {
  constructor(private sectionService: SectionService) {}

  @Get('project/:projectId')
  findAll(@Param('projectId') projectId: string) {
    return this.sectionService.findAll(Number(projectId));
  }

  @Post('project/:projectId')
  create(@Param('projectId') projectId: string, @Body('title') title: string) {
    return this.sectionService.create(Number(projectId), title);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.sectionService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.sectionService.delete(Number(id));
  }
}
