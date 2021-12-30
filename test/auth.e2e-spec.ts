import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { V1_BASE_PATH } from '../src/contants';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../test/utils/globalSetup';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('/${V1_BASE_PATH}/auth/signup should fail', () => {
    return request(app.getHttpServer())
      .post(`${V1_BASE_PATH}/auth/signup`)
      .expect(400);
  });
});
