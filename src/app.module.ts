import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { MONGODB_REPO_CONNECTION } from './configurations/properties';
import { CaslModule } from './casl/casl.module';
import { ConnectionsModule } from './entities/connections/connections.module';
import { UsersModule } from './entities/users/users.module';
import { DataModelsModule } from './entities/data-models/data-models.module';
import { ProjectsModule } from './entities/projects/projects.module';

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    MongooseModule.forRoot(MONGODB_REPO_CONNECTION),
    CaslModule,
    ConnectionsModule,
    UsersModule,
    DataModelsModule,
    ProjectsModule,
  ],
})
export class AppModule {}
