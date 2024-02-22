import { NestFactory } from '@nestjs/core';
import { EmailserviceModule } from './emailservice.module';

async function bootstrap() {
  const app = await NestFactory.create(EmailserviceModule);
  await app.listen(3004);
}
bootstrap();
