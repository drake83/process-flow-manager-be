import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/utils/globalSetup';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AuthModule],
    }).compile();
    module.init();
    service = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await module.close();
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('validateUser should trow exception', async () => {
    try {
      expect(await service.validateUser('NOTEXISTING', 'wrong'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });
  it('validateUser should trow exception because wrong password', async () => {
    try {
      expect(await service.validateUser('ROOT', 'wrong'));
      fail();
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('changePassword should be ok', async () => {
    const { username, roles, resetPassword } = await service.changePassword({
      username: 'ROOT',
      oldPassword: 'DUMMYPASSWORD',
      password: 'DUMMYPASSWORDCHANGED',
    });
    expect(username).toBe('ROOT');
    expect(roles).toStrictEqual(['admin']);
    expect(resetPassword).toBeFalsy();
    const valid = await service.validateUser('ROOT', 'DUMMYPASSWORDCHANGED');
    expect(valid.username).toBe('ROOT');
    expect(valid.roles).toStrictEqual(['admin']);
    expect(valid.resetPassword).toBeFalsy();
  });
});
