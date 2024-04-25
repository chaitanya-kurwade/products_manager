import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ProductsModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('TCP_HOST'),
      port: configService.get('TCP_PORT'),
    },
  });
  await app.startAllMicroservices();
  app.useStaticAssets(path.join(__dirname, '../../../uploads'));
  await app.listen(+configService.getOrThrow('PRODUCTS_APP_PORT'), () => {
    console.log(
      `ProductsModule started on http://localhost:${+configService.getOrThrow(
        'PRODUCTS_APP_PORT',
      )}/graphql`,
    );
  });
}
bootstrap();
