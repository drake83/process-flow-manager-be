import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { passwordRegex } from '../../../contants';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(passwordRegex, {
    message: 'password too weak',
  })
  password: string;
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  username: string;
}
