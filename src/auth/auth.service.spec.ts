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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AuthModule],
    }).compile();
    module.init();
    service = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
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
});
