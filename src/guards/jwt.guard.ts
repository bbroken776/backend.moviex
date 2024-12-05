import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserDTO } from 'src/dtos/users/user.dto';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = UserDTO>(err: any, user: UserDTO | null, info: any): TUser {
    if (err || !user) throw err || new HttpException('Your token is invalid or expired. Provide a valid token!', 401);

    return user as TUser;
  }
}
