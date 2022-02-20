import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GenericUnauthorizedException } from '../errors/GenericUnauthorizedException';
import { WrongUserNamePasswordException } from '../errors/WrongUserNamePasswordException';
import { UsersService } from '../entities/users/users.service';
import { UserDTO } from '../entities/users/models/dto/users.dto';
import { ResetPasswordDTO } from './models/dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, userPassword: string): Promise<UserDTO> {
    let user: UserDTO;
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
    const { username, permissions: roles, email } = user;
    return {
      access_token: this.jwtService.sign({ username, roles, email }),
    };
  }
}
