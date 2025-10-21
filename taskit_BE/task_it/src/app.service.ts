import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'TaskIt API - Welcome to the Task Management System!';
  }
}