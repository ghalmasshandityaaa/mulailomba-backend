import { CreateEventCommand } from './create-event/create-event.command';
import { CreateEventHandler } from './create-event/create-event.handler';
import { PublishEventCommand } from './publish-event/publish-event.command';
import { PublishEventHandler } from './publish-event/publish-event.handler';

export { CreateEventCommand, PublishEventCommand };

export const CommandHandlers = [CreateEventHandler, PublishEventHandler];
