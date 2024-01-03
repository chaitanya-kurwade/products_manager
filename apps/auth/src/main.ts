import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
