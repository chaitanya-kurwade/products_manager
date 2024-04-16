import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
      load: [configuration],
    }),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        context: ({ req }) => ({
          headers: req.headers,
        }),
        cache: 'bounded',
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
      },

      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'auth',
              url: `http://localhost:${configuration().auth.port}/graphql`,
            },
            {
              name: 'products',
              url: `http://localhost:${configuration().products.port}/graphql`,
            },
            {
              name: 'uploadimage',
              url: `http://localhost:${configuration().uploadimage.port}/graphql`,
            },
            {
              name: 'emailservice',
              url: `http://localhost:${configuration().emailservice.port}/graphql`,
            },
          ],
        }),
        buildService({ url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
              request.http.headers.set('authorization', context?.headers?.authorization);
              request.http.headers.set(
                'apollo-require-preflight',
                context?.headers?.apollo_require_preflight,
              );
            },
          });
        },
      },
    }),
  ],
})
export class GatewayModule {}
