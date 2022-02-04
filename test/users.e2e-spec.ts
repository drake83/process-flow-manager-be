import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { V1_BASE_PATH, V1_SECURITY_PATH } from '../src/contants';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from './utils/globalSetup';
import * as assert from 'assert';
import { User } from 'src/users/models/schema/users.schema';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await closeInMongodConnection();
  });

  describe('/v1/api/secured/profile', () => {
    it('should get 401 because not a valid token', async () => {
      return request(app.getHttpServer())
        .get(`${V1_SECURITY_PATH}/profile`)
        .expect(401)
        .then((resp) => {
          assert(resp.body !== undefined);
          const { statusCode, message } = resp.body;
          assert(statusCode === 401);
          assert(message === 'Unauthorized');
        });
    });

    it('should get profile data with a valid token', async () => {
      await request(app.getHttpServer())
        .post(`${V1_SECURITY_PATH}/auth/reset-password`)
        .send({
          username: 'ROOT',
          oldPassword: 'DUMMYPASSWORD',
          password: 'DUMMYPASSWORDCHANGED',
        })
        .expect(201);

      const loginReq: any = await request(app.getHttpServer())
        .post(`${V1_BASE_PATH}/auth/login`)
        .send({ username: 'ROOT', password: 'DUMMYPASSWORDCHANGED' })
        .expect(201);
      const token = loginReq?.body?.access_token;

      return request(app.getHttpServer())
        .get(`${V1_SECURITY_PATH}/profile`)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((resp) => {
          assert(resp.body !== undefined);
          const {
            username,
            roles = [],
            email,
            resetPassword,
          } = resp.body as User;
          assert(roles.includes('admin'));
          assert(username === 'ROOT');
          assert(email === 'alessandro.drago@gmail.com');
          assert(resetPassword === false);
        });
    });
  });
});
