import { JsonOrganizerProps, OrganizerQueryModel } from '@mulailomba/organizer/interfaces';
import { JsonOrganizerSerializer } from '@mulailomba/organizer/serializers/json.organizer.serializer';

export class FindAccountOrganizersResult {
  readonly organizers: Array<JsonOrganizerProps & { total_event?: number }>;

  constructor(collections: Array<OrganizerQueryModel & { totalEvent?: number }>) {
    this.organizers = collections.map((collection) => ({
      ...JsonOrganizerSerializer.serialize({ ...collection }),
      total_event: collection.totalEvent || 0,
    }));
  }
}
