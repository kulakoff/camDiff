import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: false});
  app.enableCors({credentials: false, origin: false})
  await app.listen(process.env.APP_PORT || 4002);
}
bootstrap();
