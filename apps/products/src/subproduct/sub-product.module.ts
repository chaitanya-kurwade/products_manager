import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';

import { SubProductService } from './sub-product.service';
import { SubProductResolver } from './sub-product.resolver';
import { SubProduct, SubProductSchema } from './entities/sub-product.entity';
import { SubProductController } from './sub-product.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([
      {
        name: SubProduct.name,
        schema: SubProductSchema,
      },
    ]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_URL'),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'customers',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('TCP_HOST'),
            port: configService.get<number>('CUSTOMER_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
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
  controllers: [SubProductController],
  providers: [SubProductResolver, SubProductService],
  exports: [SubProductResolver, SubProductService],
})
export class SubProductModule {}
