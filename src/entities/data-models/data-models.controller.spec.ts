import { Test, TestingModule } from '@nestjs/testing';
import { DataModelsController } from './data-models.controller';

describe('DataModelsController', () => {
  let controller: DataModelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataModelsController],
    }).compile();

    controller = module.get<DataModelsController>(DataModelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
