import { Module } from '@nestjs/common';
import { EmailserviceService } from './emailservice.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendEmail, SendEmailSchema } from './entity/sendemail.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailserviceController } from './emailservice.controller';
import { EmailserviceResolver } from './emailservice.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/emailservice/.env',
    }),
    ClientsModule.registerAsync([
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
    ]),
    MongooseModule.forFeature([
      {
        name: SendEmail.name,
        schema: SendEmailSchema,
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
  ],
  controllers: [EmailserviceController],
  exports: [EmailserviceService, EmailserviceResolver],
  providers: [EmailserviceService, EmailserviceResolver],
})
export class EmailserviceModule {}
