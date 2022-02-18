import { Module } from '@nestjs/common';
import { DataModelsService } from './data-models.service';
import { DataModelsController } from './data-models.controller';

@Module({
  providers: [DataModelsService],
  controllers: [DataModelsController]
})
export class DataModelsModule {}
