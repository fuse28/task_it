import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectAccessModule } from '../project-access.module';

@Module({
  imports: [ProjectAccessModule],
  controllers: [CommentController],
  providers: [CommentService, PrismaService],
})
export class CommentModule {}
