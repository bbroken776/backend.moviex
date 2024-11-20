import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenCleanupService } from './token-cleanup.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
    PrismaModule,
    ConfigModule,
    ScheduleModule,
  ],
  providers: [AuthService, TokenCleanupService, JwtStrategy],
  controllers: [AuthController],
})

export class AuthModule {
  constructor(private tokenCleanupService: TokenCleanupService) {
    const job = this.cleanupExpiredTokens.bind(this);
    setInterval(job, 60 * 60 * 1000);
  }

  async cleanupExpiredTokens() {
    await this.tokenCleanupService.removeExpiredTokens();
  }
}
