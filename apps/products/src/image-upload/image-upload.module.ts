import { Module } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadResolver } from './image-upload.resolver';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageUpload, ImageUploadSchema } from './entities/image-upload.entity';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'common/library/guards/jwt.auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/products/.env',
    }),
    MongooseModule.forFeature([
      {
        name: ImageUpload.name,
        schema: ImageUploadSchema,
      },
    ]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground: false,
    }),
  ],
  providers: [
    ImageUploadResolver,
    ImageUploadService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
  exports: [ImageUploadResolver, ImageUploadService],
})
export class ImageUploadModule {}
