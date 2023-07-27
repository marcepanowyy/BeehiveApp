import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import 'dotenv/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {

  constructor(@Inject(UsersService) private readonly usersService: UsersService) {

    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: process.env.GOOGLE_SCOPE.split(','),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(profile);
    await this.usersService.validateGoogleUser({
      email: profile.emails[0].value,
      displayName: profile.displayName,
    });
  }
}
