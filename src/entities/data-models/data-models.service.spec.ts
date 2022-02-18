import { Test, TestingModule } from '@nestjs/testing';
import { DataModelsService } from './data-models.service';

describe('DataModelsService', () => {
  let service: DataModelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataModelsService],
    }).compile();

    service = module.get<DataModelsService>(DataModelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
