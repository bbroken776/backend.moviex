import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'src/dtos/auth/login.dto';
import { CreateUserDTO } from 'src/dtos/users/create-user.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { UserDTO } from 'src/dtos/users/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(data: LoginDTO) {
    const user: UserDTO = await this.usersService.findByEmail(data.email);
    if (!user) throw new HttpException('Could not find any user with that email', 401);

    const passwordMatch = await this.usersService.validatePassword(data.email, data.password);
    if (!passwordMatch) throw new HttpException('Invalid credentials', 401);

    const payload = { email: user.email, id: user.id };
    const expiresIn = 30 * 24 * 60 * 60;
    const token = this.jwtService.sign(payload, { expiresIn });

    const expirationDate = new Date(Date.now() + expiresIn * 1000);
    await this.prisma.token.create({
      data: {
        userId: user.id,
        token: token,
        expiresAt: expirationDate,
      },
    });

    return { user, token };
  }

  async register(createUserDto: CreateUserDTO) {
    const user = await this.usersService.create(createUserDto);
    const payload = { email: user.email, id: user.id };

    const expiresIn = 30 * 24 * 60 * 60;
    const token = this.jwtService.sign(payload, { expiresIn });

    const expirationDate = new Date(Date.now() + expiresIn * 1000);
    await this.prisma.token.create({
      data: {
        userId: user.id,
        token: token,
        expiresAt: expirationDate,
      },
    });

    return { user, token };
  }
}
