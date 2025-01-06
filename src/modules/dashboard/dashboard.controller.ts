import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MoviesService } from '../movies/movies.service';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private usersService: UsersService,
    private moviesService: MoviesService,
  ) {}

  @Get('/')
  @UseGuards(AdminGuard)
  async stats() {
    const users = await this.usersService.findAll();
    const movies = await this.moviesService.findAll();
    const likes = await Promise.all(
      users.map(async u => {
        return await this.usersService.findLikedMovies(u);
      }),
    ).then(likes => likes.flat());

    return {
      users: users.length,
      movies: movies.length,
      likes: likes.length,
    };
  }

  @Get('/movies')
  @UseGuards(AdminGuard)
  async movies() {
    return await this.moviesService.findAll();
  }
}
