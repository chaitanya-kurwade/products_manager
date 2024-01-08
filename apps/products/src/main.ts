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
  }))
  app.use(
    '/graphql',
    graphqlUploadExpress({maxFileSize:1000000, maxFiles:10}),
  );
  await app.listen(+configService.getOrThrow('APP_PORT'), () => {
    console.log(
      `Server started on http://localhost:${+configService.getOrThrow(
        'APP_PORT',
      )}`,
    );
  });
}
bootstrap();
