import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, connection, ConnectOptions, disconnect } from 'mongoose';

let mongod: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create({
        instance: { dbName: 'process-flow' },
      });
      const mongoUri = mongod.getUri();
      const mongooseOpts: ConnectOptions = {
        dbName: 'process-flow',
      };
      await connect(mongoUri, mongooseOpts);
      await connection.db.dropCollection('users').catch((err) => {
        console.log('Collection not existing');
      });
      const usersCollection = await connection.db.createCollection('users');
      await usersCollection.insertOne({
        username: 'ROOT',
        email: 'email@email.com',
        password: 'password',
        roles: ['admin'],
        created: new Date(),
        resetPassword: false,
      });
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeInMongodConnection = async () => {
  if (mongod) await mongod.stop();
  await disconnect();
};
