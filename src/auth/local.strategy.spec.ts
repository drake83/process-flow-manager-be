import { Test, TestingModule } from '@nestjs/testing';
import { GenericUnauthorizedException } from '../errors/GenericUnauthorizedException';
import { ResetPasswordException } from '../errors/ResetPasswordException';
import { WrongUserNamePasswordException } from '../errors/WrongUserNamePasswordException';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/utils/globalSetup';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let service: LocalStrategy;
  let authService: AuthService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AuthModule],
    }).compile();
    module.init();
    service = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await module.close();
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validateUser should trow ResetPasswordException', async () => {
    try {
      expect(await service.validate('NOTEXISTING', 'DUMMYPASSWORD'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(GenericUnauthorizedException);
    }
  });
  it('validateUser should trow ResetPasswordException', async () => {
    try {
      expect(await service.validate('ROOT', 'DUMMYPASSWORD'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(ResetPasswordException);
    }
  });

  it('validateUser should trow WrongUserNamePasswordException', async () => {
    try {
      expect(await service.validate('ROOT', 'WRONG'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(WrongUserNamePasswordException);
    }
  });

  it('validateUser should be ok', async () => {
    await authService.changePassword({
      username: 'ROOT',
      oldPassword: 'DUMMYPASSWORD',
      password: '1Aaaaaaapppppakaaa.',
    });
    const { username, roles, resetPassword } = await service.validate(
      'ROOT',
      '1Aaaaaaapppppakaaa.',
    );
    expect(username).toBe('ROOT');
    expect(roles).toStrictEqual(['admin']);
    expect(resetPassword).toBeFalsy();
  });
});
