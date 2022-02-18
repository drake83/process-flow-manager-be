import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MONGODB_REPO_CONNECTION } from './configurations/properties';
import { CaslModule } from './casl/casl.module';
import { ConnectionsModule } from './entities/connections/connections.module';
import { ProfilesModule } from './entities/profiles/profiles.module';
import { DataModelsModule } from './entities/data-models/data-models.module';
import { ProjectsModule } from './entities/projects/projects.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(MONGODB_REPO_CONNECTION),
    CaslModule,
    ConnectionsModule,
    ProfilesModule,
    DataModelsModule,
    ProjectsModule,
  ],
})
export class AppModule {}
