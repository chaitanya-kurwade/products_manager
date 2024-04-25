import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(+configService.getOrThrow('ORDERS_APP_PORT'), () => {
    console.log(
      `OrdersModule started on http://localhost:${+configService.getOrThrow(
        'ORDERS_APP_PORT',
      )}/graphql`,
    );
  });
}
bootstrap();
