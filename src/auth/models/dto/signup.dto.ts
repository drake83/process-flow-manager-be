import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from 'src/users/models/schema/users.schema';

export class SignupDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  public password: string;

  @IsEmail()
  public email: string;

  public role: Role;
}
