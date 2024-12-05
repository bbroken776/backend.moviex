import { IsNumber, IsString } from 'class-validator';

export class CreateMovieDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString({ each: true })
  genres: string[];

  @IsNumber()
  year: number;

  @IsNumber()
  duration: number;

  @IsString()
  poster: string;

  @IsString()
  banner: string;
}
