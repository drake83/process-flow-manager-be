import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersModule } from './users.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/utils/globalSetup';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), UsersModule],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  describe('Users Controller Login', () => {
    it('should not create user without token', () => {
      expect(usersController.create({ email: '' })).toBe('Hello World!');
    });
  });
});
