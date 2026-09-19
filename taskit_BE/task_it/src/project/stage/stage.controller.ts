import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { StageService } from './stage.service';

@Controller('stages')
export class StageController {
  constructor(private stageService: StageService) {}

  @Get('section/:sectionId')
  findAll(@Param('sectionId') sectionId: string) {
    return this.stageService.findAll(Number(sectionId));
  }

  @Post('section/:sectionId')
  create(@Param('sectionId') sectionId: string, @Body('title') title: string) {
    return this.stageService.create(Number(sectionId), title);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.stageService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.stageService.delete(Number(id));
  }
}
