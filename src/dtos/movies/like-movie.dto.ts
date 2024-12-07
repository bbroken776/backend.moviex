import { IsInt, IsNotEmpty } from 'class-validator';

export class LikeMovieDto {
  @IsInt()
  @IsNotEmpty()
  movieId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
