import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import mongoUnit from 'mongo-unit';
import { UsersService } from './users.service';
import testData from '../../test/data/data.json';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    await mongoUnit.start({ dbName: 'processflow', port: 27018 }).then(() => {
      console.log('fake mongo is started: ', mongoUnit.getUrl());
    });

    await mongoUnit.load(testData);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: 'mongodb://127.0.0.1:27018/processflow',
          }),
        }),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await mongoUnit.stop();
  });

  it('should not find aanything', () => {
    expect(service.findOne('NOT_EXISTING')).toBeDefined();
  });
});
