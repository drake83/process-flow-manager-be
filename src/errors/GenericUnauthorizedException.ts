import { UnauthorizedException } from '@nestjs/common';

export class GenericUnauthorizedException extends UnauthorizedException {
  constructor() {
    super({
      statusCode: 401,
      detailedStatusCode: 40101,
      message: 'Unauthorized',
    });
  }
}
