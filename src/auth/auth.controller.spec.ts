import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/utils/globalSetup';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AuthModule],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  describe('Auth Controller Login', () => {
    it('should return a valid token', () => {
      expect(authController.login({ user: {} })).toBe('');
    });
  });
  describe('Auth Controller Signup', () => {
    it('should return a valid user', () => {
      expect(authController.signup({})).toStrictEqual({});
    });
  });
});
