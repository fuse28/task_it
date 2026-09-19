import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('stage/:stageId')
  findAll(@Param('stageId') stageId: string) {
    return this.taskService.findAll(Number(stageId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(Number(id));
  }

  @Post('stage/:stageId')
  create(
    @Param('stageId') stageId: string,
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    return this.taskService.create(Number(stageId), title, description);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.taskService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.taskService.delete(Number(id));
  }
}
