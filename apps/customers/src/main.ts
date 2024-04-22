import { NestFactory } from '@nestjs/core';
import { CustomersModule } from './customers.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(CustomersModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('TCP_HOST'),
      port: configService.get('TCP_PORT'),
    },
  });
  await app.startAllMicroservices();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(+configService.getOrThrow('CUSTOMER_APP_PORT'), () => {
    console.log(
      `CustomersModule started on http://localhost:${+configService.getOrThrow(
        'CUSTOMER_APP_PORT',
      )}/graphql`,
    );
  });
}
bootstrap();
