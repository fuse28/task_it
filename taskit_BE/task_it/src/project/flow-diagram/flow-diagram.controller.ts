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
import { FlowDiagramService } from './flow-diagram.service';
import { CreateFlowDiagramDto, UpdateFlowDiagramDto } from './flow-diagram.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('flow-diagrams')
export class FlowDiagramController {
  constructor(private flowDiagramService: FlowDiagramService) {}

  @Get('project/:projectId')
  findAllForProject(@Param('projectId') projectId: string, @Request() req) {
    return this.flowDiagramService.findAllForProject(
      Number(projectId),
      req.user.id,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.flowDiagramService.findOne(Number(id), req.user.id);
  }

  @Post()
  create(@Body() dto: CreateFlowDiagramDto, @Request() req) {
    return this.flowDiagramService.create(dto, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFlowDiagramDto,
    @Request() req,
  ) {
    return this.flowDiagramService.update(Number(id), dto, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.flowDiagramService.delete(Number(id), req.user.id);
  }
}
