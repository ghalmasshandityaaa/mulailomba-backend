import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { EventPublishEvent } from '../domains/events';
import { EVENT_CATEGORY_WRITE_REPOSITORY } from '../event.constants';
import { IEventCategoryWriteRepository } from '../interfaces';

@EventsHandler(EventPublishEvent)
export class PublishEventListener implements IEventHandler<EventPublishEvent> {
  constructor(
    @InjectPinoLogger(PublishEventListener.name)
    private logger: PinoLogger,
    @Inject(EVENT_CATEGORY_WRITE_REPOSITORY)
    private readonly repository: IEventCategoryWriteRepository,
  ) {}

  /**
   *
   * @param event
   */
  async handle(event: EventPublishEvent) {
    this.logger.trace(`BEGIN`);
    this.logger.info({ event });

    const eventCategories = await this.repository.findByEventId(event.data.id);
    eventCategories.map((category) => category.publishEvent());
    this.repository.save(eventCategories);

    this.logger.trace(`END`);
  }
}
