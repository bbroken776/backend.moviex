import { Exclude } from 'class-transformer';
import { IsIn } from 'class-validator';
import { MovieDTO } from '../movies/movie.dto';

export class UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

  @IsIn(['USER', 'ADMIN'])
  role: string;

  @Exclude()
  password: string;

  likedMovies?: MovieDTO[];

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}