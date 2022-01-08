import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import * as mongoUnit from 'mongo-unit';
import { MONGODB_REPO_CONNECTION } from '../../src/configurations/properties';
import { config } from './config';

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      await mongoUnit
        .start({ dbName: config.dbName, port: +config.port })
        .then(() => {
          console.log('fake mongo is started: ', mongoUnit.getUrl());
        });
      return {
        uri: MONGODB_REPO_CONNECTION,
        dbName: config.dbName,
        localAddress: config.host,
        ...options,
      };
    },
  });

export const closeInMongodConnection = async () => {
  return mongoUnit.stop();
};
