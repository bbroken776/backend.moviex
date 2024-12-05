import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateMovieDTO } from 'src/dtos/movies/create-movie.dto';
import { MovieDTO } from 'src/dtos/movies/movie.dto';
import { MoviesService } from './movies.service';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createMovieDTO: CreateMovieDTO): Promise<MovieDTO> {
    return await this.moviesService.create(createMovieDTO);
  }

  @Get()
  async findAll(): Promise<MovieDTO[]> {
    return await this.moviesService.findAll();
  }

  @Get(':id')
  async findById(id: number): Promise<MovieDTO> {
    return await this.moviesService.findById(id);
  }

  @Get(':title')
  async findByTitle(title: string): Promise<MovieDTO> {
    return await this.moviesService.findByTitle(title);
  }
}
