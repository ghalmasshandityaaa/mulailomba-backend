import { JsonUserProps, UserQueryModel } from '@mulailomba/user/interfaces';
import { JsonUserSerializer } from '@mulailomba/user/serializers';
import { Exclude, Expose } from 'class-transformer';

export class LoginUserResult {
  @Expose({ name: 'access_token' })
  readonly accessToken: string;

  @Exclude()
  readonly refreshToken: string;

  readonly identity: JsonUserProps;

  constructor(token: { accessToken: string; refreshToken: string }, user: UserQueryModel) {
    this.accessToken = token.accessToken;
    this.refreshToken = token.refreshToken;
    this.identity = JsonUserSerializer.serialize(user);
  }
}
