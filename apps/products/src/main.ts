import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';


import { graphqlUploadExpress } from 'graphql-upload-ts';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
  }))
  app.use(
    '/graphql',
    graphqlUploadExpress({maxFileSize:1000000, maxFiles:10}),
  );
  await app.listen(3001);
  console.log('products started on 3001');

}
bootstrap();
