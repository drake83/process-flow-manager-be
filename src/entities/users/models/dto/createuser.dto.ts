import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import Permission from '../../../../enums/permissions/permissions';

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
  permissions: Permission[];
}
