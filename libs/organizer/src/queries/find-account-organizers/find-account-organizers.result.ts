import { JsonOrganizerProps, OrganizerQueryModel } from '@mulailomba/organizer/interfaces';
import { JsonOrganizerSerializer } from '@mulailomba/organizer/serializers/json.organizer.serializer';

export class FindAccountOrganizersResult {
  readonly organizers: Array<JsonOrganizerProps & { totalEvent?: number }>;

  constructor(collections: Array<OrganizerQueryModel & { totalEvent?: number }>) {
    this.organizers = collections.map((collection) => ({
      ...JsonOrganizerSerializer.serialize({ ...collection }),
      totalEvent: collection.totalEvent || 0,
    }));
  }
}
