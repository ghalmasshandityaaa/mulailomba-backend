import { Exclude, Expose } from 'class-transformer';

export class SwitchAccountResult {
  @Expose({ name: 'access_token' })
  readonly accessToken: string;

  @Exclude()
  readonly refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
