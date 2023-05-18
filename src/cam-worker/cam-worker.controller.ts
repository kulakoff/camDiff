import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { CamWorkerService } from './cam-worker.service';
import { CreateCamWorkerDto } from './dto/create-cam-worker.dto';
import { UpdateCamWorkerDto } from './dto/update-cam-worker.dto';

@Controller('cam-worker')
export class CamWorkerController {
  constructor(private readonly camWorkerService: CamWorkerService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() createCamWorkerDto: CreateCamWorkerDto) {
    // console.log(createCamWorkerDto);
    return this.camWorkerService.create(createCamWorkerDto);
  }

  //Not used
  @Get()
  findAll() {
    return this.camWorkerService.findAll();
  }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.camWorkerService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCamWorkerDto: UpdateCamWorkerDto) {
  //   return this.camWorkerService.update(+id, updateCamWorkerDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.camWorkerService.remove(+id);
  // }
}
