import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateMovieDTO } from 'src/dtos/movies/create-movie.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import responseHelper from 'src/helpers/responde.helper';
import { MoviesService } from './movies.service';
import { LikeMovieDto } from 'src/dtos/movies/like-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createMovieDTO: CreateMovieDTO) {
    try {
      await this.moviesService.create(createMovieDTO);
      return responseHelper(HttpStatus.CREATED, 'Movie created successfully');
    } catch (error) {
      return responseHelper(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  @Get()
  async findAll() {
    const movies = await this.moviesService.findAll();
    return responseHelper(HttpStatus.OK, 'Movies fetched successfully', { movies });
  }

  @Get('/most-liked')
  async findMostLiked() {
    const movies = await this.moviesService.findMostLiked();
    return responseHelper(HttpStatus.OK, 'Most liked movies fetched successfully', { movies });
  }

  @Get('recent')
  async getRecentMovies() {
    const movies = await this.moviesService.getRecentMovies();
    return responseHelper(HttpStatus.OK, 'Recent movies fetched successfully', { movies });
  }

  @Post('like')
  @UseGuards(JwtAuthGuard)
  async likeMovie(@Body() likeMovieDTO: LikeMovieDto) {
    await this.moviesService.likeMovie(likeMovieDTO.movieId, likeMovieDTO.userId);
    return responseHelper(HttpStatus.OK, 'Movie liked successfully');
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const movie = await this.moviesService.findById(id);
    return responseHelper(HttpStatus.OK, 'Movie fetched successfully', { movie });
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Body() movieDTO: Partial<CreateMovieDTO>) {
    await this.moviesService.update(movieDTO.id, movieDTO);
    return responseHelper(HttpStatus.OK, 'Movie updated successfully');
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: number) {
    await this.moviesService.delete(id);
    return responseHelper(HttpStatus.OK, 'Movie deleted successfully');
  }
}
