import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Signup } from './models/dto/signup.dto';
import { BaseUserDTO, UserDTO } from '../users/models/dto/users.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    userName: string,
    userPassword: string,
  ): Promise<BaseUserDTO> {
    const user = await this.userService.findOne(userName);
    if (!user) {
      return null;
    }
    const { password, userId, email, username, role, resetPassword, created } =
      user;
    if (password === userPassword) {
      return { ...{ userId, email, username, role, resetPassword, created } };
    }
  }

  async login(user: BaseUserDTO) {
    const { username, userId, email } = user;
    return {
      access_token: this.jwtService.sign({ username, sub: userId, email }),
    };
  }
  async signup(user: Signup) {
    const { username, password, email, confirmationPassword } = user;

    // save to db
  }
}
