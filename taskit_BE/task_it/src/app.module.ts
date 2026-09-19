import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { ProjectModule } from './project/project.module';
import { SectionModule } from './project/section/sections.module';
import { StageModule } from './project/stage/stage.module';
import { TaskModule } from './project/task/task.module';
import { CommentModule } from './project/comment/comment.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProjectModule,
    SectionModule,
    StageModule,
    TaskModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
