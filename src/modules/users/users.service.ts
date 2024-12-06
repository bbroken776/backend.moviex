import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { CreateUserDTO } from 'src/dtos/users/create-user.dto';
import { UserDTO } from 'src/dtos/users/user.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDTO): Promise<UserDTO> {
    const existsUser: UserDTO | null = await this.findByEmail(data.email);
    if (existsUser) throw new HttpException('There\'s already a user with this email', 400);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    return plainToClass(UserDTO, user);
  }

  async findById(id: number): Promise<UserDTO | null> {
    const user: UserDTO | null = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    return plainToClass(UserDTO, user);
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const user: UserDTO | null = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    return plainToClass(UserDTO, user);
  }

  async findAll(): Promise<UserDTO[]> {
    const users: UserDTO[] = await this.prisma.user.findMany();
    if (!users) throw new HttpException('No users found', 404);

    return users.map(user => plainToClass(UserDTO, user));
  }

  async update(id: number, data: CreateUserDTO): Promise<UserDTO> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user: UserDTO | null = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new HttpException('User not found', 404);

    return bcrypt.compare(password, user.password);
  }
}