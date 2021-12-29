import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: 'mongodb://127.0.0.1:27018/processflow',
          }),
        }),
        AuthModule,
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('Auth Controller Login', () => {
    it('should return "Hello World!"', () => {
      expect(authController.login({ user: {} })).toBe('Hello World!');
    });
  });
});
