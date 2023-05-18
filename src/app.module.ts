import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CamWorkerModule } from './cam-worker/cam-worker.module';
import { BullModule } from '@nestjs/bull';
import { QUEUE_CAM_DIFFERENCE } from './constants';
import { BullBoardModule } from '@nestql/bull-board';
import { CamWorkerController } from './cam-worker/cam-worker.controller';
import { CamWorkerService } from './cam-worker/cam-worker.service';
import {ConsumerService} from './cam-worker/consumer/consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    // CamWorkerModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QUEUE_CAM_DIFFERENCE
    }),
    BullBoardModule.register({autoAdd: true, path: 'dashboard'})
  ],
  controllers: [AppController, CamWorkerController],
  providers: [AppService, CamWorkerService, ConsumerService],
})
export class AppModule {}
