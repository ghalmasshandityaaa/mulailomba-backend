import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.getOrThrow('META_CLIENT_ID'),
      clientSecret: config.getOrThrow('META_CLIENT_SECRET'),
      callbackURL: config.getOrThrow('META_REDIRECT_URL'),
      scope: ['email', 'public_profile', 'user_gender'],
      profileFields: ['emails', 'name', 'profileUrl', 'gender', 'displayName', 'photos'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const user = {
      email: profile.emails?.[0].value,
      displayName: profile.displayName,
      firstName: profile.name?.givenName,
      middleName: profile.name?.middleName,
      lastName: profile.name?.familyName,
      photos: profile.photos?.[0].value,
      gender: profile.gender,
    };

    done(null, user);
  }
}
