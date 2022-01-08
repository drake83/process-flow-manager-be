import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class PasswordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
  oldPassword: string;
}
