import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.use(
    ['/images'],
    createProxyMiddleware({
      target: `http://localhost:${configService.getOrThrow('IMAGE_APP_PORT')}`,
      changeOrigin: true,
    }),
  );
  await app.startAllMicroservices();
  await app.listen(+configService.getOrThrow('GATEWAY_APP_PORT'), () => {
    console.log(
      `GatewayModule started on http://localhost:${+configService.getOrThrow(
        'GATEWAY_APP_PORT',
      )}/graphql`,
    );
  });
}
bootstrap();
