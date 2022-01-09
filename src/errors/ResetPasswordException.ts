import { UnauthorizedException } from '@nestjs/common';

export class ResetPasswordException extends UnauthorizedException {
  constructor() {
    super({
      statusCode: 401,
      detailedStatusCode: 40102,
      message: 'Unauthorized: user must change password',
    });
  }
}
