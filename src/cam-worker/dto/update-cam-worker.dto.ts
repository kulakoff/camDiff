import { PartialType } from '@nestjs/mapped-types';
import { CreateCamWorkerDto } from './create-cam-worker.dto';

export class UpdateCamWorkerDto extends PartialType(CreateCamWorkerDto) {}
