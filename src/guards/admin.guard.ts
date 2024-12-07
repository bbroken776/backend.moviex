import { CanActivate, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDTO } from 'src/dtos/users/user.dto';
import { JwtAuthGuard } from './jwt.guard';
import { log } from 'console';

@Injectable()
export class AdminGuard extends JwtAuthGuard implements CanActivate {
  handleRequest<TUser = UserDTO>(err: any, user: UserDTO | null, info: any): TUser {
    super.handleRequest(err, user, info);

    if (!user || user.role !== 'ADMIN')
      throw new HttpException('Your token is invalid or expired. Please provide an admin token!', 401);

    return user as TUser;
  }
}
