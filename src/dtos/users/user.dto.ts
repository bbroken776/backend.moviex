import { Exclude } from 'class-transformer';

export class UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;

  @Exclude()
  password: string;

  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
