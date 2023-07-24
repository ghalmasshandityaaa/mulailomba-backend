import { Expose } from 'class-transformer';

export class RefreshTokenResult {
  @Expose({ name: 'access_token' })
  readonly accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
