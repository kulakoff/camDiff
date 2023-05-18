import { Injectable } from '@nestjs/common';
import { CreateCamWorkerDto } from './dto/create-cam-worker.dto';
import { UpdateCamWorkerDto } from './dto/update-cam-worker.dto';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_CAM_DIFFERENCE } from '../constants';
import { Queue } from 'bull';

@Injectable()
export class CamWorkerService {
  constructor(
    @InjectQueue(QUEUE_CAM_DIFFERENCE)
    private  readonly  camDifferenceQueue: Queue
  ) {}
  async create(createCamWorkerDto: CreateCamWorkerDto) {
    // return 'This action adds a new camWorker';
    return await this.camDifferenceQueue.add(createCamWorkerDto);
  }

  findAll() {
    return `This action returns all camWorker`;
  }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} camWorker`;
  // }
  //
  // update(id: number, updateCamWorkerDto: UpdateCamWorkerDto) {
  //   return `This action updates a #${id} camWorker`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} camWorker`;
  // }
}
