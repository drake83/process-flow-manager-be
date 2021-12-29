import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class Signup {
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

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches('password')
  public confirmationPassword: string;

  constructor(
    username: string,
    password: string,
    confirmationPassword: string,
  ) {
    this.username = username;
    this.password = password;
    this.confirmationPassword = confirmationPassword;
  }
}
