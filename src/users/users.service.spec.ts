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

  beforeAll(async () => {
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

  it('find ', async () => {
    const fount = await service.findOne('ROOT');
    const { username, resetPassword, roles, email } = fount;
    expect(username).toBe('ROOT');
    expect(resetPassword).toBe(false);
    expect(roles).toStrictEqual(['admin']);
    expect(email).toBe('email@email.com');
  });
  it('save  ', async () => {
    await service.save({
      username: 'ROOT2',
      email: 'email2@email.com',
      password: 'password',
      roles: ['admin'],
      created: new Date(),
      resetPassword: false,
    });
    const fount = await service.findOne('ROOT2');
    const { username, resetPassword, roles, email } = fount;
    expect(username).toBe('ROOT2');
    expect(resetPassword).toBe(false);
    expect(roles).toStrictEqual(['admin']);
    expect(email).toBe('email2@email.com');
  });
});
