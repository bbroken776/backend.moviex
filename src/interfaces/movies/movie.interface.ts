export default interface IMovie {
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
}
