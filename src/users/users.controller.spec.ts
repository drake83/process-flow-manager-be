import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersModule } from './users.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/utils/globalSetup';
import { ForbiddenException } from '@nestjs/common';
import { fail } from 'assert';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), UsersModule],
    }).compile();

    app.init();
    usersController = app.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  describe('Users Controller Login', () => {
    it('should not create user without token', async () => {
      try {
        await usersController.create({
          email: 'dummy',
          username: 'dummy',
          roles: ['admin'],
        });
        fail();
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
