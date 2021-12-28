import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv } from 'crypto';
import { generate } from 'password-hash';
import { isNull, isUndefined } from 'lodash';
import { IV_KEY } from 'src/configurations/properties';
import { User } from '../models/users.model';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class UsersService {
  async findOne(username: string) {
    return User.findOne().byUserName(username);
  }

  static encrypt(text: string) {
    const secretInBytes = Buffer.from(jwtConstants.secret, 'base64');
    const cipher = createCipheriv('aes-256-gcm', secretInBytes, IV_KEY);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  static decrypt(text: string) {
    if (isNull(text) || isUndefined(text)) {
      return text;
    }
    const secretInBytes = Buffer.from(jwtConstants.secret, 'base64');
    const decipher = createDecipheriv('aes-256-gcm', secretInBytes, IV_KEY);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }

  static hashing(val: string) {
    return generate(val);
  }
}
