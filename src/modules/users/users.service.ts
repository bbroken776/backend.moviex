import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { CreateUserDTO } from 'src/dtos/users/create-user.dto';
import { UserDTO } from 'src/dtos/users/user.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDTO): Promise<UserDTO> {
    const existsUser = await this.findByEmail(data.email);
    if (existsUser) throw new HttpException("There's already a user with this email", 400);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    return plainToClass(UserDTO, user);
  }

  async findById(id: number): Promise<UserDTO | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return plainToClass(UserDTO, user);
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return plainToClass(UserDTO, user);
  }

  async findAll(): Promise<UserDTO[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => plainToClass(UserDTO, user));
  }

  async update(id: number, data: Partial<UserDTO>): Promise<UserDTO> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const updatedData: Partial<User> = {};

    if (data.password) {
      const isPasswordSame = await bcrypt.compare(data.password, user.password);
      if (isPasswordSame) {
        throw new HttpException('New password is the same as the old password', HttpStatus.BAD_REQUEST);
      }
      updatedData.password = await bcrypt.hash(data.password, 10);
    }

    for (const key in data) {
      if (data[key] !== undefined && data[key] !== user[key]) {
        updatedData[key] = data[key];
      }
    }

    if (Object.keys(updatedData).length === 0) {
      throw new HttpException('No changes were made.', HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return plainToClass(UserDTO, updatedUser);
  }

  async delete(id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.token.deleteMany({
      where: { userId: id },
    });

    await this.prisma.user.delete({
      where: { id },
    });
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new HttpException('User not found', 404);

    return bcrypt.compare(password, user.password);
  }
}
