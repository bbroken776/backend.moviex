import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDTO } from 'src/dtos/users/create-user.dto';
import { ILogin } from 'src/interfaces/auth/login.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: ILogin) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDTO) {
    return this.authService.register(createUserDto);
  }
}
