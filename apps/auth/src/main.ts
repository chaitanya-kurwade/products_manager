import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
  }))
  await app.listen(3000);
  console.log('auth started on 3000');
  
}
bootstrap();
