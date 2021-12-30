import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDTO } from './models/dto/signup.dto';
import { BaseUserDTO } from '../users/models/dto/users.dto';
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
    /**
     * TODO: decrypt password
     */
    const { password, email, username, roles, resetPassword, created } = user;
    if (UsersService.hashing(password) === userPassword) {
      return { ...{ email, username, roles, resetPassword, created } };
    }
  }

  async login(user: BaseUserDTO) {
    const { username, roles, email } = user;
    return {
      access_token: this.jwtService.sign({ username, roles, email }),
    };
  }
  async signup(user: SignupDTO) {
    const { username, password, email, role } = user;

    // save to db
  }
}
