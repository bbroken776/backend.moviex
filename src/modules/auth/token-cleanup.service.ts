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

  async verifyToken(token: string) {
    const now = new Date();
    const tokenRecord = await this.prisma.token.findUnique({
      where: {
        token,
      },
    });

    if (!tokenRecord || tokenRecord.expiresAt < now) {
      return false;
    }

    return true;
  }
}
