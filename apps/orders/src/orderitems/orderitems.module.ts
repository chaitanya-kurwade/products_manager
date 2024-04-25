import { Module } from '@nestjs/common';
import { OrderItemsService } from './orderitems.service';
import { OrderItemsResolver } from './orderitems.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { OrderItem, OrderItemSchema } from './entities/orderitem.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([
      {
        name: OrderItem.name,
        schema: OrderItemSchema,
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
  providers: [OrderItemsResolver, OrderItemsService],
  exports: [OrderItemsResolver, OrderItemsService],
})
export class OrderItemsModule { }
