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
import Permission from '../../../../enums/permissions/permissions';

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
  permissions: Permission[];

  @IsNotEmpty()
  @IsBoolean()
  resetPassword?: boolean;

  @Exclude()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(passwordRegex, {
    message: 'password too weak',
  })
  password?: string;

  @IsNotEmpty()
  @IsDate()
  created: Date;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
