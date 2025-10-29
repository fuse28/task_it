import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private makePublicId(prefix: string) {
    return `${prefix}-${uuidv4().slice(0, 8)}`;
  }

  async create(createUserDto: CreateUserDto) {
    const publicId = this.makePublicId('USR');
    return this.prisma.user.create({
      data: { ...createUserDto, publicId },
      select: {
        id: true,
        email: true,
        name: true,
        accountType: true,
      },
    });
  }

  async findAll() {
    const allUser = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        accountType: true,
      },
    });
    return allUser;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        accountType: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: Partial<CreateUserDto>) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        accountType: true,
      },
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
