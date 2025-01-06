import { HttpException, Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';
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

    const posterBytes = data.poster ? Buffer.from(data.poster, 'base64') : null;
    const bannerBytes = data.banner ? Buffer.from(data.banner, 'base64') : null;

    const movieData = {
      ...data,
      poster: posterBytes,
      banner: bannerBytes,
    };

    const movie = await this.prisma.movie.create({ data: movieData });
    return this.decompressMovie(movie);
  }

  async update(id: number, data: Partial<CreateMovieDTO>): Promise<MovieDTO> {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new HttpException('Movie not found', 404);
  
    let updatedData: Partial<Movie> = {};
  
    for (const key in data) {
      if (data[key] !== undefined && data[key] !== movie[key]) {
        updatedData[key] = data[key];
      }
    }
  
    if (Object.keys(updatedData).length === 0) {
      throw new HttpException('No changes detected', 400);
    }
    
    const updatedMovie = await this.prisma.movie.update({
      where: { id },
      data: updatedData,
    });

  
    return this.decompressMovie(updatedMovie);
  }

  async delete(id: number): Promise<void> {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new HttpException('Movie not found', 404);

    await this.prisma.movie.delete({ where: { id } });
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

  async likeMovie(movieId: number, userId: number): Promise<void> {
    const movie = await this.prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) throw new HttpException('Movie not found', 404);

    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { likedMovies: true } });
    if (!user) throw new HttpException('User not found', 404);

    const alreadyLiked = user.likedMovies.some(likedMovie => likedMovie.id === movieId);
    if (alreadyLiked) throw new HttpException('User already liked this movie', 400);

    await this.prisma.movie.update({ where: { id: movieId }, data: { likes: movie.likes + 1 } });
    await this.prisma.user.update({ where: { id: userId }, data: { likedMovies: { connect: { id: movieId } } } });
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
      poster: data.poster ? data.poster.toString('base64') : null,
      banner: data.banner ? data.banner.toString('base64') : null,
      source: data.source,
      likes: data.likes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
