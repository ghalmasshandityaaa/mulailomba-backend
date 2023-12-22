import { OrganizerAggregate } from '@mulailomba/organizer/domains';
import { JsonOrganizerProps } from '@mulailomba/organizer/interfaces';
import { JsonOrganizerSerializer } from '@mulailomba/organizer/serializers';
import { Exclude, Expose } from 'class-transformer';

export class RegisterOrganizerResult {
  @Expose({ name: 'access_token' })
  readonly accessToken: string;

  @Exclude()
  readonly refreshToken: string;

  readonly identity: JsonOrganizerProps;

  constructor(token: { accessToken: string; refreshToken: string }, organizer: OrganizerAggregate) {
    this.accessToken = token.accessToken;
    this.refreshToken = token.refreshToken;
    this.identity = JsonOrganizerSerializer.serialize({
      id: organizer.id,
      ...organizer.props,
    });
  }
}
