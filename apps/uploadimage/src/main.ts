import { NestFactory } from '@nestjs/core';
import { UploadimageModule } from './uploadimage.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(UploadimageModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  // app.use(
  //   '/graphql',
  //   graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }),
  // );
  await app.listen(+configService.getOrThrow('IMAGE_APP_PORT'), () => {
    console.log(
      `Server started on http://localhost:${+configService.getOrThrow(
        'IMAGE_APP_PORT',
      )}/graphql`,
    );
  });
}
bootstrap();
