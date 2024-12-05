export class MovieDTO {
  id?: number;
  title: string;
  description: string;
  genres: string[];
  year: number;
  duration: number;
  poster: string;
  banner: string;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<MovieDTO>) {
    Object.assign(this, partial);
  }
}
