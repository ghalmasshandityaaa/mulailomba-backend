import { JsonOrganizerProps, OrganizerQueryModel } from '@mulailomba/organizer/interfaces';
import { JsonOrganizerSerializer } from '@mulailomba/organizer/serializers';
import { Exclude, Expose } from 'class-transformer';

export class SwitchAccountResult {
  @Expose({ name: 'access_token' })
  readonly accessToken: string;

  @Exclude()
  readonly refreshToken: string;

  readonly identity: JsonOrganizerProps;

  constructor(accessToken: string, refreshToken: string, organizer: OrganizerQueryModel) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.identity = JsonOrganizerSerializer.serialize(organizer);
  }
}
