// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { UsersService } from 'apps/auth/src/users/users.service';
// import { User } from 'apps/auth/src/users/entities/user.entity';

// @Injectable()
// export class RefreshTokenJwtStrategy extends PassportStrategy(
//   Strategy,
//   'jwt-refresh',
// ) {
//   constructor(
//     private readonly userService: UsersService,
//     public readonly configService: ConfigService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
//       ignoreExpiration: false,
//       secretOrKey: configService.get('JWT_SECRET'),
//     });
//   }

//   async validate(payload: { email: string; _id: string }): Promise<User> {
//     const user = await this.userService.getUserByEmailId(payload.email);
//     if (!user) {
//       throw new UnauthorizedException('Invalid token in jwt strategy');
//     }
//     return user;
//   }
// }
