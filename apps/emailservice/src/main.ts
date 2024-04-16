import { NestFactory } from '@nestjs/core';
import { EmailserviceModule } from './emailservice.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(EmailserviceModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 1801,
    },
  });
  await app.startAllMicroservices();
  await app.listen(+configService.getOrThrow('EMAILSERVICE_APP_PORT'), () => {
    console.log(
      `EmailServiceModule started on http://localhost:${+configService.getOrThrow(
        'EMAILSERVICE_APP_PORT',
      )}/graphql`,
    );
  });
}
bootstrap();
