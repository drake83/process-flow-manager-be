import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../../../types';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsArray()
  @IsNotEmpty()
  roles: Role[];
}
