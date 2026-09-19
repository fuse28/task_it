import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('tasks/:taskId/comments')
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentService.create(
      Number(taskId),
      req.user.id,
      dto.content,
      dto.mentionedUserIds,
    );
  }

  @Put('comments/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.commentService.update(
      Number(id),
      req.user.id,
      dto.content,
      dto.mentionedUserIds,
    );
  }

  @Delete('comments/:id')
  delete(@Param('id') id: string, @Request() req) {
    return this.commentService.delete(Number(id), req.user.id);
  }
}
