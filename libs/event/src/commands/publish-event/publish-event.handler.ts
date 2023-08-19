import { EventError } from '@mulailomba/event/errors';
import {
  EVENT_CATEGORY_STATUS_ENUM,
  EVENT_CATEGORY_WRITE_REPOSITORY,
  EVENT_WRITE_REPOSITORY,
} from '@mulailomba/event/event.constants';
import { IEventCategoryWriteRepository, IEventWriteRepository } from '@mulailomba/event/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { PublishEventCommand } from './publish-event.command';

@CommandHandler(PublishEventCommand)
export class PublishEventHandler implements ICommandHandler<PublishEventCommand, void> {
  constructor(
    @InjectPinoLogger(PublishEventHandler.name)
    private readonly logger: PinoLogger,
    @Inject(EVENT_WRITE_REPOSITORY)
    private readonly repository: IEventWriteRepository,
    @Inject(EVENT_CATEGORY_WRITE_REPOSITORY)
    private readonly eventCategoryRepository: IEventCategoryWriteRepository,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: PublishEventCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const [event, eventCategories] = await Promise.all([
      this.repository.findById(command.id, command.organizerId),
      this.eventCategoryRepository.findByEventId(command.id),
    ]);

    if (!event) {
      throw new EventError.NotFound();
    } else if (!eventCategories.every((c) => c.props.status === EVENT_CATEGORY_STATUS_ENUM.DRAFT)) {
      throw new EventError.InvalidStatusTransition();
    }

    event.publishEvent();
    event.commit();

    this.logger.trace(`END`);
  }
}
