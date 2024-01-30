import { NestFactory } from '@nestjs/core';
import { UploadimageModule } from './upload-image.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(UploadimageModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  await app.listen(+configService.getOrThrow('IMAGE_APP_PORT'), () => {
    console.log(
      `Server started on http://localhost:${+configService.getOrThrow(
        'IMAGE_APP_PORT',
      )}/graphql`,
    );
  });
}
bootstrap();
