export class MovieDTO {
  id?: number;
  title: string;
  description: string;
  genres: string[];
  year: number;
  duration: number;

  poster: string;
  banner: string;
  source: string;

  likes?: number;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<MovieDTO>) {
    Object.assign(this, partial);
  }
}
