import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokenCleanupService {
  constructor(private readonly prisma: PrismaService) {}

  async removeExpiredTokens() {
    const now = new Date();
    await this.prisma.token.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
  }
}
