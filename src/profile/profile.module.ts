import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { UsersModule } from '../entities/users/users.module';

@Module({
  controllers: [ProfileController],
  imports: [UsersModule],
})
export class ProfileModule {}
