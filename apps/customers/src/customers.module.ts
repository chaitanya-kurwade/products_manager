import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersResolver } from './customers.resolver';
import { CartsModule } from './carts/carts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './entities/customer.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { CustomersController } from './customers.controller';

@Module({
  imports: [
    CartsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/customers/.env',
    }),
    MongooseModule.forFeature([
      {
        name: Customer.name,
        schema: CustomerSchema,
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
      introspection: true,
      autoSchemaFile: {
        federation: 2,
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground: false,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`, // in seconds
        },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'emailservice',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('TCP_HOST'),
            port: configService.get<number>('EMAIL_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'auth',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('TCP_HOST'),
            port: configService.get<number>('AUTH_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'products',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('TCP_HOST'),
            port: configService.get<number>('PRODUCTS_TCP_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CustomersController],
  providers: [CustomersResolver, CustomersService],
  exports: [CustomersResolver, CustomersService],
})
export class CustomersModule { }
