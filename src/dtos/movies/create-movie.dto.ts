import { Optional } from '@nestjs/common';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovieDTO {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  genres: string;

  @IsNumber()
  year: number;

  @IsNumber()
  duration: number;

  @IsString()
  poster: string;

  @IsString()
  banner: string;

  @IsString()
  source: string;

  @IsOptional()
  @IsNumber()
  likes?: number;
}
