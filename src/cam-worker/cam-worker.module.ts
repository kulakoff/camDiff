import { Module } from '@nestjs/common';
import { CamWorkerService } from './cam-worker.service';
import { CamWorkerController } from './cam-worker.controller';
import { ConsumerService } from './consumer/consumer.service';

@Module({
  imports:[],
  controllers: [CamWorkerController],
  providers: [CamWorkerService, ConsumerService],
  exports: []
})
export class CamWorkerModule {}
