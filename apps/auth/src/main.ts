import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(+configService.getOrThrow('AUTH_APP_PORT'), () => {
    console.log(
      `AuthModule started on http://localhost:${+configService.getOrThrow(
        'AUTH_APP_PORT',
      )}/graphql`,
    );
  });
}
bootstrap();
