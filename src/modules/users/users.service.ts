import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { plainToClass, plainToInstance } from 'class-transformer';

import { CreateUserDTO } from 'src/dtos/users/create-user.dto';
import { UserDTO } from 'src/dtos/users/user.dto';
import { IUser } from 'src/interfaces/users/user.interface';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDTO): Promise<UserDTO> {
    const existsUser: IUser | null = await this.findByEmail(data.email);
    if (existsUser) throw new HttpException('Theres already a user with this email', 400);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    return plainToClass(UserDTO, user);
  }

  async findById(id: number): Promise<UserDTO> {
    const user: IUser | null = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new HttpException('User not found', 404);

    return plainToClass(UserDTO, user);
  }

  async findByEmail(email: string): Promise<UserDTO> {
    const user: IUser | null = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new HttpException('User not found', 404);

    return plainToClass(UserDTO, user);
  }

  async findAll(): Promise<UserDTO[]> {
    const users: IUser[] | [] = await this.prisma.user.findMany();
    if (!users) throw new HttpException('No users found', 404);

    return users.map(user => plainToClass(UserDTO, user));
  }

  async update(id: number, data: CreateUserDTO): Promise<IUser> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async validatePassword(email: string, hashedPassword: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new HttpException('User not found', 404);

    return bcrypt.compare(hashedPassword, user.password);
  }
}
