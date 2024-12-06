import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/users/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/dtos/auth/login.dto';
import responseHelper from 'src/helpers/responde.helper';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    const { user, token } = await this.authService.login(body);
    return responseHelper(HttpStatus.OK, 'Login successful', { user, token });
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDTO) {
    const { user, token } = await this.authService.register(createUserDto);
    return responseHelper(HttpStatus.CREATED, 'User created successfully', { user, token });
  }
}
