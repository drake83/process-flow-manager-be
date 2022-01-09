import { UnauthorizedException } from '@nestjs/common';

export class WrongUserNamePasswordException extends UnauthorizedException {
  constructor() {
    super({
      statusCode: 401,
      detailedStatusCode: 40103,
      message: 'Unauthorized: wrong username or password',
    });
  }
}
