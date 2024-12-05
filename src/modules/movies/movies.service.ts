import { HttpException, Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { CreateMovieDTO } from 'src/dtos/movies/create-movie.dto';
import { MovieDTO } from 'src/dtos/movies/movie.dto';
import IMovie from 'src/interfaces/movies/movie.interface';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMovieDTO): Promise<MovieDTO> {
    const existsMovie = await this.prisma.movie.findFirst({ where: { title: data.title } });
    if (existsMovie) throw new HttpException('Theres already a movie with this title', 400);

    const movie = await this.prisma.movie.create({ data: this.compressMovie(data) });
    return plainToClass(MovieDTO, this.decompressMovie(movie));
  }

  async findById(id: number): Promise<MovieDTO> {
    const movie: Movie | null = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new HttpException('Movie not found', 404);

    return this.decompressMovie(movie);
  }

  async findAll(): Promise<MovieDTO[]> {
    const movies: Movie[] | [] = await this.prisma.movie.findMany();
    if (!movies) throw new HttpException('No movies found', 404);

    return movies.map(movie => this.decompressMovie(movie));
  }

  async findMostLiked(): Promise<MovieDTO[]> {
    const movies: Movie[] | [] = await this.prisma.movie.findMany({ orderBy: { likes: 'desc' }, take: 5 });
    if (!movies) throw new HttpException('No movies found', 404);

    return movies.map(movie => this.decompressMovie(movie));
  }

  decompressMovie(data: Movie): IMovie {
    const genres = data.genres.split(',').map(genre => genre.trim());
    return { ...data, genres };
  }

  compressMovie(data: MovieDTO): any {
    const genres = data.genres.join(', ');
    return { ...data, genres } as Partial<Movie>;
  }
}
