import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from './auth.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/utils/globalSetup';
import { UsersModule } from '../users/users.module';
import { INestApplication } from '@nestjs/common';
import { V1_BASE_PATH } from '../contants';

describe('AuthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AuthModule, UsersModule],
    }).compile();
    module.init();
    app = module.createNestApplication();
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  });

  describe('Auth Controller Login', () => {
    it('should NOT return a valid token', async () => {
      return request(app.getHttpServer())
        .post(`${V1_BASE_PATH}/auth/login`)
        .send({ username: 'NOT_EXISTING', password: 'NOT' })
        .expect(401);
    });
  });
});
