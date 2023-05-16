import { Module } from '@nestjs/common';
import { CamWorkerService } from './cam-worker.service';
import { CamWorkerController } from './cam-worker.controller';

@Module({
  controllers: [CamWorkerController],
  providers: [CamWorkerService]
})
export class CamWorkerModule {}
