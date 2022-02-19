import { Exclude } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { passwordRegex } from '../../../../contants';
import { Role } from '../../../../types';

export class UserDTO {
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

  @IsNotEmpty()
  @IsBoolean()
  resetPassword?: boolean;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(passwordRegex, {
    message: 'password too weak',
  })
  @Exclude()
  password?: string;

  @IsNotEmpty()
  @IsDate()
  created: Date;
}
