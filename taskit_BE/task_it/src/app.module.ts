import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [AuthModule, UsersModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
