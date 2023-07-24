import { JsonOrganizerProps, OrganizerQueryModel } from '@mulailomba/organizer/interfaces';
import { JsonOrganizerSerializer } from '@mulailomba/organizer/serializers';
import { Exclude, Expose } from 'class-transformer';

export class LoginOrganizerResult {
  @Expose({ name: 'access_token' })
  readonly accessToken: string;

  @Exclude()
  readonly refreshToken: string;

  readonly identity: JsonOrganizerProps;

  constructor(
    token: { accessToken: string; refreshToken: string },
    organizer: OrganizerQueryModel,
  ) {
    this.accessToken = token.accessToken;
    this.refreshToken = token.refreshToken;
    this.identity = JsonOrganizerSerializer.serialize(organizer);
  }
}
