import { JsonOrganizerProps, OrganizerQueryModel } from '@mulailomba/organizer/interfaces';
import { JsonOrganizerSerializer } from '@mulailomba/organizer/serializers/json.organizer.serializer';

export class FindOrganizerResult {
  readonly organizer: JsonOrganizerProps;

  constructor(organizer: OrganizerQueryModel) {
    this.organizer = JsonOrganizerSerializer.serialize(organizer);
  }
}
