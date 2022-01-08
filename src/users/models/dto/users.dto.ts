import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../schema/users.schema';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  username: string;

  @IsEmail()
  email: string;

  roles: Role[];

  resetPassword?: boolean;

  password?: string;
}
