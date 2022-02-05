import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { V1_BASE_PATH } from '../src/contants';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test/utils/globalSetup';
import * as assert from 'assert';

describe('AppController (e2e)', () => {
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

  describe('/v1/api/auth/login', () => {
    it('should NOT return a valid token', async () => {
      return request(app.getHttpServer())
        .post(`${V1_BASE_PATH}/auth/login`)
        .send({ username: 'NOT_EXISTING', password: 'NOT' })
        .expect(401)
        .then((resp) => {
          assert(resp.body !== undefined);
          const { detailedStatusCode, message } = resp.body;
          assert(detailedStatusCode === 40101);
          assert(message === 'Unauthorized');
        });
    });
    it('should return 401 for changing password', async () => {
      return request(app.getHttpServer())
        .post(`${V1_BASE_PATH}/auth/login`)
        .send({ username: 'ROOT', password: 'DUMMYPASSWORD' })
        .expect(401)
        .then((resp) => {
          assert(resp.body !== undefined);
          const { detailedStatusCode, message } = resp.body;
          assert(detailedStatusCode === 40102);
          assert(message === 'Unauthorized: user must change password');
        });
    });
    it('should return 401 for wrong password', async () => {
      return request(app.getHttpServer())
        .post(`${V1_BASE_PATH}/auth/login`)
        .send({ username: 'ROOT', password: 'WRONG' })
        .expect(401)
        .then((resp) => {
          assert(resp.body !== undefined);
          const { detailedStatusCode, message } = resp.body;
          assert(detailedStatusCode === 40103);
          assert(message === 'Unauthorized: wrong username or password');
        });
    });
    it('should get 400', async () => {
      await request(app.getHttpServer())
        .post(`${V1_BASE_PATH}/auth/reset-password`)
        .send({
          username: 'ROOT',
          oldPassword: 'DUMMYPASSWORD',
          password: 'annnn.l',
        })
        .expect(400);
    });
    it('should return a valid token', async () => {
      await request(app.getHttpServer())
        .post(`${V1_BASE_PATH}/auth/reset-password`)
        .send({
          username: 'ROOT',
          oldPassword: 'DUMMYPASSWORD',
          password: '1Aaaaaaapppppakaaa.',
        })
        .expect(201);

      return request(app.getHttpServer())
        .post(`${V1_BASE_PATH}/auth/login`)
        .send({ username: 'ROOT', password: '1Aaaaaaapppppakaaa.' })
        .expect(201)
        .then((resp) => {
          const { access_token } = resp.body;
          assert(access_token !== undefined);
        });
    });
  });
});
