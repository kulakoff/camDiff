import { Injectable, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_CAM_DIFFERENCE } from '../../constants';

// @Injectable()
@Processor(QUEUE_CAM_DIFFERENCE)
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);
  @Process()
  async difference(job: Job) {
    this.logger.log(`Added new task id: ${job.id}`);
    this.logger.debug('Data from job', job.data);
    //test worker
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 8000));
    this.logger.log(`Difference task complete: ${job.id}`);
  }
}
