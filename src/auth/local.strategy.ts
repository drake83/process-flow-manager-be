import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ErrorMessage } from 'src/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!!user.resetPassword) {
      const errorMessage: ErrorMessage = {
        statusCode: 401,
        detailedStatusCode: 40102,
        message: 'Unauthorized: user must change password',
      };
      throw new UnauthorizedException(errorMessage);
    }

    return user;
  }
}
