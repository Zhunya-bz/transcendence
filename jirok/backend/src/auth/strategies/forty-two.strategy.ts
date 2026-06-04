import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',

      tokenURL: 'https://api.intra.42.fr/oauth/token',

      clientID: config.getOrThrow('FORTY_TWO_CLIENT_ID'),

      clientSecret: config.getOrThrow('FORTY_TWO_CLIENT_SECRET'),

      callbackURL: config.getOrThrow('FORTY_TWO_CALLBACK_URL'),
    });
  }

  async validate(accessToken: string) {
    return this.authService.validate42User(accessToken);
  }
}
