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
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('stage/:stageId')
  findAll(@Param('stageId') stageId: string, @Request() req) {
    return this.taskService.findAll(Number(stageId), req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.taskService.findOne(Number(id), req.user.id);
  }

  @Post('stage/:stageId')
  create(
    @Param('stageId') stageId: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Request() req,
  ) {
    return this.taskService.create(
      Number(stageId),
      title,
      description,
      req.user.id,
    );
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.taskService.update(Number(id), data, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.taskService.delete(Number(id), req.user.id);
  }
}
