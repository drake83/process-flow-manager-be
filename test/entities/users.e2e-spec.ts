import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { V1_SECURITY_PATH } from '../../src/contants';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../utils/globalSetup';
import * as assert from 'assert';
import { getAdmimToken as getAdminToken } from '../../test/utils/utils';

import { UserDTO } from '../../src/entities/users/models/dto/users.dto';
import { UsersService } from '../../src/entities/users/users.service';
import { UsersPermission } from '../../src/enums/permissions/users.permissions';
import { ProjectsPermission } from '../../src/enums/permissions/projects.permissions';
import { DataModelsPermission } from '../../src/enums/permissions/data-models.permissions';
import { ConnectionsPermission } from '../../src/enums/permissions/connections.permissions';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    token = await getAdminToken(app);
  });

  afterAll(async () => {
    await app.close();
    await closeInMongodConnection();
  });

  describe('/v1/api/secured/users/create', () => {
    it('should not create users', async () => {
      await request(app.getHttpServer())
        .post(`${V1_SECURITY_PATH}/users/create`)
        .send({
          username: 'ROOT2',
          email: 'alessandro.io@gmail.com',
          permissions: [
            UsersPermission.AdminUsers,
            ProjectsPermission.AdminProjects,
            DataModelsPermission.AdminDataModels,
            ConnectionsPermission.AdminConnections,
          ],
        })
        .expect(401);
    });
    it('should create users', async () => {
      await request(app.getHttpServer())
        .post(`${V1_SECURITY_PATH}/users/create`)
        .set('Authorization', 'Bearer ' + token)
        .send({
          username: 'ROOT2',
          email: 'alessandro.io@gmail.com',
          permissions: [UsersPermission.AdminUsers],
        })
        .expect(201)
        .then((resp) => {
          assert(resp.body !== undefined);
          const {
            username,
            permissions = [],
            email,
            resetPassword,
            password,
          } = resp.body as UserDTO;
          assert(UsersService.decrypt(username) === 'ROOT2');
          assert(UsersService.decrypt(email) === 'alessandro.io@gmail.com');
          assert(resetPassword === true);
          //assert(password === undefined);

          permissions.forEach((permission) => {
            assert(
              UsersService.decrypt(permission) === UsersPermission.AdminUsers,
            );
          });
        });
    });
  });
});
