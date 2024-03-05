import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '785864541062-lg6i75nvm0s9h8qpgoju3169up94tqiu.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL:
        'https://ddhlb4gj-3000.inc1.devtunnels.ms/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validateInStrategy(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { name, email, photos } = profile;

    const user = {
      email: email,
      firstName: name,
      picture: photos,
      accessToken,
      refreshToken,
    };
    console.log(user);
  }
}
