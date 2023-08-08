import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

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

  // evoked when users successfully authenticated themselves

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {

    const {name, emails, photos} = profile

    const user = {
      email: emails[0].value,
      lastName: name.familyName,
      firstName: name.givenName,
      picture: photos[0].value,
      accessToken
    };

    done(null, user)

    // console.log(profile)
    // const user = await this.usersService.validateGoogleUser({
    //   email: profile.emails[0].value,
    //   displayName: profile.displayName,
    // });
    // return user || null

  }
}
