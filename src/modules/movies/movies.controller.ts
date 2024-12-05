import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateMovieDTO } from 'src/dtos/movies/create-movie.dto';
import { MovieDTO } from 'src/dtos/movies/movie.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import MulterFile from 'src/interfaces/movies/multerfile.interface';
import { MoviesService } from './movies.service';

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
    @UploadedFile('poster') poster: MulterFile,
    @UploadedFile('banner') banner: MulterFile,
  ): Promise<MovieDTO> {
    const movieData = {
      ...createMovieDTO,
      posterPath: poster ? `uploads/posters/${poster.filename}` : undefined,
      bannerPath: banner ? `uploads/banners/${banner.filename}` : undefined,
    };

    return await this.moviesService.create(movieData);
  }

  @Get()
  async findAll(): Promise<MovieDTO[]> {
    return await this.moviesService.findAll();
  }

  @Get('/most-liked')
  async findMostLiked(): Promise<MovieDTO[]> {
    return await this.moviesService.findMostLiked();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<MovieDTO> {
    return await this.moviesService.findById(id);
  }
}
