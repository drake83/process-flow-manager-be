import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { V1_SECURITY_PATH } from '../src/contants';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from './utils/globalSetup';
import * as assert from 'assert';
import { User } from '../src/users/models/schema/users.schema';
import { getAdmimToken as getAdminToken } from '../test/utils/utils';
import { UsersService } from '../src/users/users.service';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AppModule],
      //providers: [UsersService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    token = await getAdminToken(app);
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
          assert(username === 'ROOT');
          assert(email === 'alessandro.drago@gmail.com');
          assert(roles.includes('admin'));
          assert(resetPassword === false);
        });
    });
  });

  describe('/v1/api/secured/create', () => {
    it('should not create users', async () => {
      await request(app.getHttpServer())
        .post(`${V1_SECURITY_PATH}/create`)
        .send({
          username: 'ROOT2',
          email: 'alessandro.io@gmail.com',
          roles: ['admin'],
        })
        .expect(401);
    });
    it('should create users', async () => {
      await request(app.getHttpServer())
        .post(`${V1_SECURITY_PATH}/create`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          username: 'ROOT2',
          email: 'alessandro.io@gmail.com',
          roles: ['admin'],
        })
        .expect(201)
        .then((resp) => {
          assert(resp.body !== undefined);
          const {
            username,
            roles = [],
            email,
            resetPassword,
          } = resp.body as User;
          assert(UsersService.decrypt(username) === 'ROOT2');
          assert(UsersService.decrypt(email) === 'alessandro.io@gmail.com');
          assert(resetPassword === true);
          assert(
            roles.map((role) => UsersService.decrypt(role)).includes('admin'),
          );
        });
    });
  });
});
