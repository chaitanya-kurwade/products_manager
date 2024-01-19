import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';

import { graphqlUploadExpress } from 'graphql-upload-ts';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }),
  );
  // app.connectMicroservice({
  //   transport: Transport.TCP,
  //   options: {
  //     host: 'localhost',
  //     port: 4010,
  //   },
  // });
  await app.listen(+configService.getOrThrow('PRODUCTS_APP_PORT'), () => {
    console.log(
      `Server started on http://localhost:${+configService.getOrThrow(
        'PRODUCTS_APP_PORT',
      )}/graphql`,
    );
  });
}
bootstrap();
