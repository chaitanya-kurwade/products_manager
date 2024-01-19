import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { JwtAuthGuard } from 'common/library/guards/jwt.auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from 'common/library/strategies/jwt.strategy';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  imports: [
    CategoryModule,
    ImageUploadModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/products/.env',
    }),
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_URL'),
      }),
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      // introspection: true,
      playground: false,
    }),
  ],
  exports: [ProductsResolver, ProductsService],
  providers: [
    ProductsResolver,
    ProductsService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class ProductsModule {}
