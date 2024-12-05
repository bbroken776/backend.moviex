import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../modules/users/users.service';
import { TokenCleanupService } from 'src/modules/auth/token-cleanup.service';
import { UserDTO } from 'src/dtos/users/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenCleanupService: TokenCleanupService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate({ email, id }: { email: string; id: number }): Promise<UserDTO> {
    return (await this.usersService.findByEmail(email)) || (await this.usersService.findById(id));
  }
}
