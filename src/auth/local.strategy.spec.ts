import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AuthModule],
    }).compile();
    module.init();
    service = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validateUser should trow exception', async () => {
    try {
      expect(await service.validate('ROOT', 'DUMMYPASSWORD'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('validateUser should be ok', async () => {
    await authService.changePassword({
      username: 'ROOT',
      oldPassword: 'DUMMYPASSWORD',
      password: 'DUMMYPASSWORDCHANGED',
    });
    const { username, roles, resetPassword } = await service.validate(
      'ROOT',
      'DUMMYPASSWORDCHANGED',
    );
    expect(username).toBe('ROOT');
    expect(roles).toStrictEqual(['admin']);
    expect(resetPassword).toBeFalsy();
  });
});
