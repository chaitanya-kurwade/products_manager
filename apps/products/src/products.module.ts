import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { JwtAuthGuard } from 'common/library/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from 'common/library/strategies/jwt-strategy';
import { MasterProductModule } from './masterproduct/master-product.module';
import { SubProductModule } from './subproduct/sub-product.module';
import { RolesGuard } from 'common/library/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CategoryModule,
    MasterProductModule,
    SubProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/products/.env',
    }),
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

  providers: [
    JwtStrategy,
    JwtService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class ProductsModule { }
