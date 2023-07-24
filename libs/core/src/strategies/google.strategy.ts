import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.getOrThrow('OAUTH_CLIENT_ID'),
      clientSecret: config.getOrThrow('OAUTH_CLIENT_SECRET'),
      callbackURL: config.getOrThrow('OAUTH_REDIRECT_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const user = {
      email: profile.emails?.[0].value,
      displayName: profile.displayName,
      firstName: profile.name?.givenName,
      middleName: profile.name?.middleName,
      lastName: profile.name?.familyName,
      photos: profile.photos?.[0].value,
    };

    done(null, user);
  }
}
