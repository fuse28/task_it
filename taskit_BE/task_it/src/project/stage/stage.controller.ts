import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StageService } from './stage.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('stages')
export class StageController {
  constructor(private stageService: StageService) {}

  @Get('section/:sectionId')
  findAll(@Param('sectionId') sectionId: string, @Request() req) {
    return this.stageService.findAll(Number(sectionId), req.user.id);
  }

  @Post('section/:sectionId')
  create(
    @Param('sectionId') sectionId: string,
    @Body('title') title: string,
    @Request() req,
  ) {
    return this.stageService.create(Number(sectionId), title, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.stageService.update(Number(id), data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.stageService.delete(Number(id), req.user.id);
  }
}
