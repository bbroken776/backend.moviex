import { Body, Controller, Post, HttpStatus, HttpException } from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/users/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/dtos/auth/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.handleRequest(async () => {
      const { user, token } = await this.authService.login(body);
      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: { user, token },
      };
    });
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDTO) {
    return this.handleRequest(async () => {
      const { user, token } = await this.authService.register(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: { user, token },
      };
    });
  }

  private async handleRequest(callback: () => Promise<any>) {
    try {
      const response = await callback();
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
