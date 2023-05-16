import { Test, TestingModule } from '@nestjs/testing';
import { CamWorkerService } from './cam-worker.service';

describe('CamWorkerService', () => {
  let service: CamWorkerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CamWorkerService],
    }).compile();

    service = module.get<CamWorkerService>(CamWorkerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
