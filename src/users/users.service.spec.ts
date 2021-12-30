import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/utils/globalSetup';
import { User, UserSchema } from './models/schema/users.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should not find anything', async () => {
    expect(await service.findOne('NOT_EXISTING')).toStrictEqual(null);
  });
  it('save + find ', async () => {
    await service.save({
      username: 'ROOT',
      email: 'email@email.com',
      password: 'password',
      role: 'admin',
      created: new Date(),
      resetPassword: false,
      userId: 'root',
    });
    const fount = await service.findOne('ROOT');
    const { userId, username, resetPassword, role, email } = fount;
    expect(userId).toBe('root');
    expect(username).toBe('ROOT');
    expect(resetPassword).toBe(false);
    expect(role).toBe('admin');
    expect(email).toBe('email@email.com');
    expect(email).toBe('email@email.com');
  });
});
