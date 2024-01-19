import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        context: ({ req }) => ({
          headers: req.headers,
        }),
        cache: 'bounded',
        playground: false,
        // introspection: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        // context: authContext,
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'auth',
              url: 'http://localhost:3000/graphql',
            },
            {
              name: 'products',
              url: 'http://localhost:3001/graphql',
            },
          ],
        }),
        buildService({ url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
              request.http.headers.set(
                'authorization',
                context?.headers?.authorization,
              );
            },
          });
        },
      },
    }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
