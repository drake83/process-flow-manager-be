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
import { getAdmimToken as getAdminToken } from './utils/utils';
import { UserDTO } from '../src/entities/users/models/dto/users.dto';
import { UsersPermission } from '../src/enums/permissions/users.permissions';
import { DataModelsPermission } from '../src/enums/permissions/data-models.permissions';
import { ConnectionsPermission } from '../src/enums/permissions/connections.permissions';
import { ProjectsPermission } from '../src/enums/permissions/projects.permissions';

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

  describe('/v1/api/secured/profile/detail', () => {
    it('should get 401 because not a valid token', async () => {
      return request(app.getHttpServer())
        .get(`${V1_SECURITY_PATH}/profile/detail`)
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
        .get(`${V1_SECURITY_PATH}/profile/detail`)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((resp) => {
          assert(resp.body !== undefined);
          const {
            username,
            permissions = [],
            email,
            resetPassword,
            password,
          } = resp.body as UserDTO;
          assert(username === 'ROOT');
          assert(email === 'alessandro.drago@gmail.com');
          permissions.forEach((permission) =>
            assert(
              [
                UsersPermission.AdminUsers,
                ProjectsPermission.AdminProjects,
                DataModelsPermission.AdminDataModels,
                ConnectionsPermission.AdminConnections,
              ].includes(permission),
            ),
          );

          assert(resetPassword === false);
          assert(password === undefined);
        });
    });
  });
});
