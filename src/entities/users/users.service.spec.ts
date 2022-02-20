import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionsPermission } from '../../enums/permissions/connections.permissions';
import { DataModelsPermission } from '../../enums/permissions/data-models.permissions';
import { ProjectsPermission } from '../../enums/permissions/projects.permissions';
import { UsersPermission } from '../../enums/permissions/users.permissions';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../test/utils/globalSetup';
import { User, UserSchema } from './models/schema/users.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UsersService],
    }).compile();

    await module.init();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });

  it('enrypt decrypt', () => {
    const encrypted = UsersService.encrypt('TEST');
    expect(UsersService.decrypt(encrypted)).toBe('TEST');
  });

  it('find should not find anything', async () => {
    try {
      await service.findOne('NOT_EXISTING');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('find should work', async () => {
    const fount = await service.findOne('ROOT');
    const { username, resetPassword, permissions, email } = fount;
    expect(username).toBe('ROOT');
    expect(resetPassword).toBe(true);
    expect(permissions).toStrictEqual([
      UsersPermission.AdminUsers,
      ProjectsPermission.AdminProjects,
      DataModelsPermission.AdminDataModels,
      ConnectionsPermission.AdminConnections,
    ]);
    expect(email).toBe('alessandro.drago@gmail.com');
  });
  it('save  ', async () => {
    await service.save({
      username: 'ROOT2',
      email: 'email2@email.com',
      permissions: [UsersPermission.CreateUsers],
    });
    const fount = await service.findOne('ROOT2');
    const { username, resetPassword, permissions, email } = fount;
    expect(username).toBe('ROOT2');
    expect(email).toBe('email2@email.com');
    expect(resetPassword).toBe(true);
    expect(permissions).toStrictEqual([UsersPermission.CreateUsers]);
  });
  it('save should fail ', async () => {
    try {
      await service.save({
        username: 'ROOT',
        email: 'email2@email.com',
        permissions: [ConnectionsPermission.AdminConnections],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException);
    }
  });
});
