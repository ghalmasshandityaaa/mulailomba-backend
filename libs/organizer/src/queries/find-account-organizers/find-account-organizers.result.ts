import { JsonOrganizerProps, OrganizerQueryModel } from '@mulailomba/organizer/interfaces';
import { JsonOrganizerSerializer } from '@mulailomba/organizer/serializers/json.organizer.serializer';

export class FindAccountOrganizersResult {
  readonly organizers: JsonOrganizerProps[];

  constructor(collections: OrganizerQueryModel[]) {
    this.organizers = collections.map((collection) =>
      JsonOrganizerSerializer.serialize({ ...collection }),
    );
  }
}
