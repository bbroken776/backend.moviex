import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { UsersService } from '../users/users.service';
import { MoviesService } from '../movies/movies.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, MoviesService],
  controllers: [DashboardController],
  exports: [UsersService, MoviesService],
})
export class DashboardModule {}
