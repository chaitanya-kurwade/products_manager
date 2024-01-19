import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  await app.listen(+configService.getOrThrow('GATEWAY_APP_PORT'), () => {
    console.log(
      `Server started on http://localhost:${+configService.getOrThrow(
        'GATEWAY_APP_PORT',
      )}/graphql`,
    );
  });
}
bootstrap();
