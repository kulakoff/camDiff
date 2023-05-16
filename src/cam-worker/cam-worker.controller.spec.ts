import { Test, TestingModule } from '@nestjs/testing';
import { CamWorkerController } from './cam-worker.controller';
import { CamWorkerService } from './cam-worker.service';

describe('CamWorkerController', () => {
  let controller: CamWorkerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CamWorkerController],
      providers: [CamWorkerService],
    }).compile();

    controller = module.get<CamWorkerController>(CamWorkerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
