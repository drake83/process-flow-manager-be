import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GenericUnauthorizedException } from '../errors/GenericUnauthorizedException';
import { WrongUserNamePasswordException } from '../errors/WrongUserNamePasswordException';
import { ResetPasswordDTO } from '../users/models/dto/password.dto';
import { User } from 'src/users/models/schema/users.schema';
import { UserDTO } from '../users/models/dto/users.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, userPassword: string): Promise<UserDTO> {
    let user: User;
    try {
      user = await this.userService.findOne(username);
    } catch (error) {
      throw new GenericUnauthorizedException();
    }
    const { password, ...others } = user;
    if (UsersService.verify(userPassword, password)) {
      return { ...others, password };
    }
    throw new WrongUserNamePasswordException();
  }

  async changePassword(resetPassword: ResetPasswordDTO): Promise<UserDTO> {
    const { username, oldPassword, password } = resetPassword;
    const userFound = await this.validateUser(username, oldPassword);
    await this.userService.update({
      ...userFound,
      password,
      resetPassword: false,
    });
    return this.userService.findOne(username);
  }

  async login(user: UserDTO) {
    const { username, roles, email } = user;
    return {
      access_token: this.jwtService.sign({ username, roles, email }),
    };
  }
}
