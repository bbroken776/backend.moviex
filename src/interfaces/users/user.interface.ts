export default interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}
