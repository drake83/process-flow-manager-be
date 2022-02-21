import { INestApplication } from '@nestjs/common';
import { V1_BASE_PATH } from '../../src/contants';
import * as request from 'supertest';

export const getToken = async (app: INestApplication, username = 'ROOT') => {
  await request(app.getHttpServer())
    .post(`${V1_BASE_PATH}/auth/reset-password`)
    .send({
      username,
      oldPassword: 'DUMMYPASSWORD',
      password: '1Aaaaaaapppppakaaa.',
    })
    .expect(201);

  const loginReq: any = await request(app.getHttpServer())
    .post(`${V1_BASE_PATH}/auth/login`)
    .send({ username, password: '1Aaaaaaapppppakaaa.' })
    .expect(201);
  return loginReq?.body?.access_token;
};
