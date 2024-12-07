import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateMovieDTO } from 'src/dtos/movies/create-movie.dto';
import { MovieDTO } from 'src/dtos/movies/movie.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { MoviesService } from './movies.service';
import responseHelper from 'src/helpers/responde.helper';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, callback) => {
          const movieTitle = req.body.title.replace(/\s+/g, '-');
          const fileExtension = extname(file.originalname);
          const filename = `${movieTitle}-poster${fileExtension}`;
          callback(null, filename);
        },
      }),
    }),
    FileInterceptor('banner', {
      storage: diskStorage({
        destination: './uploads/banners',
        filename: (req, file, callback) => {
          const movieTitle = req.body.title.replace(/\s+/g, '-');
          const fileExtension = extname(file.originalname);
          const filename = `${movieTitle}-banner${fileExtension}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() createMovieDTO: CreateMovieDTO,
    @UploadedFile('poster') poster: File,
    @UploadedFile('banner') banner: File,
  ) {
    const movieData = {
      ...createMovieDTO,
      posterPath: poster ? `uploads/posters/${poster.name}` : undefined,
      bannerPath: banner ? `uploads/banners/${banner.name}` : undefined,
    };

    await this.moviesService.create(movieData);
    return responseHelper(HttpStatus.CREATED, 'Movie created successfully');
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

  @Get(':id')
  async findById(@Param('id') id: number) {
    const movie = await this.moviesService.findById(id);
    return responseHelper(HttpStatus.OK, 'Movie fetched successfully', { movie });
  }
}
