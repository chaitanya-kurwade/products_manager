import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'common/library/strategies/jwt-strategy';
import { JwtAuthGuard } from 'common/library/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from 'common/library/strategies/google-strategy';
import { RolesGuard } from 'common/library/guards/roles.guard';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
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
    ClientsModule.register([
      {
        name: 'emailservice',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 1801,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthResolver,
    JwtService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    GoogleStrategy,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
