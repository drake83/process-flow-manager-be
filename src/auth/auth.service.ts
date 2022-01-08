import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../users/models/dto/users.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userName: string, userPassword: string): Promise<UserDTO> {
    try {
      const user = await this.userService.findOne(userName);
      const { password, ...others } = user;
      if (UsersService.hashing(password) === userPassword) {
        return { ...others };
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async login(user: UserDTO) {
    const { username, roles, email } = user;
    return {
      access_token: this.jwtService.sign({ username, roles, email }),
    };
  }
}
