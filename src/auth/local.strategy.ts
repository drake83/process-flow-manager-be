import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordException } from '../errors/ResetPasswordException';
import { UserDTO } from '../entities/users/models/dto/users.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserDTO> {
    const user = await this.authService.validateUser(username, password);
    if (!!user.resetPassword) {
      throw new ResetPasswordException();
    }

    return user;
  }
}
