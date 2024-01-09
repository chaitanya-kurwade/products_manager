import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UsersService,
    public readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'), //'chaitanya', //process.env.JWT_SECRET
    });
  }

  async validate(payload: { email: string; _id: string }): Promise<User> {
    const user = await this.userService.getUserByEmailId(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid token in jwt strategy');
    }
    return user;
  }
}
