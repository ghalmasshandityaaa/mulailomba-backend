import { Exclude, Expose } from 'class-transformer';

export class RegisterUserResult {
  @Expose({ name: 'access_token' })
  readonly accessToken: string;

  @Exclude()
  readonly refreshToken: string;

  constructor(token: { accessToken: string; refreshToken: string }) {
    this.accessToken = token.accessToken;
    this.refreshToken = token.refreshToken;
  }
}
