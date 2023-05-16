import { Injectable } from '@nestjs/common';
import { CreateCamWorkerDto } from './dto/create-cam-worker.dto';
import { UpdateCamWorkerDto } from './dto/update-cam-worker.dto';

@Injectable()
export class CamWorkerService {
  create(createCamWorkerDto: CreateCamWorkerDto) {
    return 'This action adds a new camWorker';
  }

  findAll() {
    return `This action returns all camWorker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} camWorker`;
  }

  update(id: number, updateCamWorkerDto: UpdateCamWorkerDto) {
    return `This action updates a #${id} camWorker`;
  }

  remove(id: number) {
    return `This action removes a #${id} camWorker`;
  }
}
