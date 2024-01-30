import { Module } from '@nestjs/common';
import { UploadimageController } from './upload-image.controller';
import { UploadimageService } from './upload-image.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { MulterModule } from '@nestjs/platform-express';
import { JwtAuthGuard, JwtStrategy } from 'common/library';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/uploadimage/.env',
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      introspection: true,
      autoSchemaFile: {
        federation: 2,
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground: false,
    }),
    MulterModule.register({
      dest: './uploads', // Specify the destination directory for uploaded files
    }),
  ],
  controllers: [UploadimageController],
  providers: [
    UploadimageService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class UploadimageModule {}
