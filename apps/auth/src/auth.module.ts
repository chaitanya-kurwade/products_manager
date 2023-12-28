import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from "@nestjs/config";


@Module({
  imports: [
    UsersModule,
     PassportModule.register({ defaultStrategy:'jwt'}),
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: './apps/auth/.env',
    }),
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,//'chaitanya', //process.env.JWT_SECRET,
    //   // secret:JWT_SECRET,
    //   signOptions:{expiresIn:'3600s'}
    // }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`, // in seconds
        },
        // signOptions:{expiresIn:'3600s'}
      }),
    }),
  ],
  controllers: [],
  providers: [AuthService, AuthResolver, JwtService, JwtStrategy],
})
export class AuthModule {}
