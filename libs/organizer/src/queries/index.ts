import { FindAccountOrganizersHandler } from './find-account-organizers/find-account-organizers.handler';
import { FindAccountOrganizersQuery } from './find-account-organizers/find-account-organizers.query';
import { FindOrganizerHandler } from './find-organizer/find-organizer.handler';
import { FindOrganizerQuery } from './find-organizer/find-organizer.query';

export { FindAccountOrganizersQuery, FindOrganizerQuery };

export const QueryHandlers = [FindAccountOrganizersHandler, FindOrganizerHandler];
