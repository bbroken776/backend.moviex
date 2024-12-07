import { HttpException, Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { CreateMovieDTO } from 'src/dtos/movies/create-movie.dto';
import { MovieDTO } from 'src/dtos/movies/movie.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMovieDTO): Promise<MovieDTO> {
    const existsMovie = await this.prisma.movie.findFirst({ where: { title: data.title } });
    if (existsMovie) {
      throw new HttpException("There's already a movie with this title", 400);
    }

    const movie = await this.prisma.movie.create({ data });
    return this.decompressMovie(movie);
  }

  async findById(id: number): Promise<MovieDTO> {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new HttpException('Movie not found', 404);
    return this.decompressMovie(movie);
  }

  async findAll(): Promise<MovieDTO[]> {
    const movies = await this.prisma.movie.findMany();
    if (!movies) throw new HttpException('No movies found', 404);
    return movies.map(movie => this.decompressMovie(movie));
  }

  async findMostLiked(): Promise<MovieDTO[]> {
    const movies = await this.prisma.movie.findMany({ orderBy: { likes: 'desc' }, take: 5 });
    if (!movies) throw new HttpException('No movies found', 404);
    
    return movies.map(movie => this.decompressMovie(movie));
  }

  async getRecentMovies(): Promise<MovieDTO[]> {
    const movies = await this.prisma.movie.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
    if (!movies) throw new HttpException('No movies found', 404);

    return movies.map(movie => this.decompressMovie(movie));
  }

  private decompressMovie(data: Movie): MovieDTO {
    const genres = data.genres.split(',').map(genre => genre.trim());
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      genres,
      year: data.year,
      duration: data.duration,
      poster: data.poster,
      banner: data.banner,
      source: data.source,
      likes: data.likes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
