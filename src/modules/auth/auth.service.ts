import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDTO } from 'src/dtos/users/create-user.dto';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { LoginDTO } from 'src/dtos/auth/login.dto';
import { UserDTO } from 'src/dtos/users/user.dto';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private prisma: PrismaService) {}

  async login(data: LoginDTO) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new HttpException("Could not find any user with that email", 401);
    
    const passwordMatch = await this.usersService.validatePassword(data.email, data.password);
    if (!passwordMatch) throw new HttpException("Invalid credentials", 401);
    
    const payload = { email: user.email, id: user.id };
    const token = this.jwtService.sign(payload);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    this.prisma.token.create({
        data: {
            userId: user.id,
            token: token,
            expiresAt: expiresAt
        }
    });

    return {
      user,
      token,
    };
  }

  async register(createUserDto: CreateUserDTO) {
    const user = await this.usersService.create(createUserDto);
    const payload = { email: user.email, id: user.id };

    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }
}
