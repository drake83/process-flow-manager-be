import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MONGODB_REPO_CONNECTION } from './configurations/properties';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(MONGODB_REPO_CONNECTION),
  ],
})
export class AppModule {}
