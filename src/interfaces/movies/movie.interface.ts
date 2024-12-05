export default interface IMovie {
  id?: number;
  title: string;
  description: string;
  genres: string[];
  year: number;
  duration: number;

  poster: string;
  banner: string;

  likes: number;

  createdAt?: Date;
  updatedAt?: Date;
}
