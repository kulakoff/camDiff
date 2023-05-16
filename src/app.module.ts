import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CamWorkerModule } from './cam-worker/cam-worker.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), CamWorkerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
