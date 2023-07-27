import { EVENT_READ_REPOSITORY } from '@mulailomba/event/event.constants';
import { IEventReadRepository } from '@mulailomba/event/interfaces';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { omit } from 'lodash';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { FindEventsByOrganizerIdQuery } from './find-events-by-organizer-id.query';
import { FindEventsByOrganizerIdResult } from './find-events-by-organizer-id.result';

@QueryHandler(FindEventsByOrganizerIdQuery)
export class FindEventsByOrganizerIdHandler
  implements IQueryHandler<FindEventsByOrganizerIdQuery, FindEventsByOrganizerIdResult>
{
  constructor(
    @InjectPinoLogger(FindEventsByOrganizerIdHandler.name)
    private logger: PinoLogger,
    @Inject(EVENT_READ_REPOSITORY)
    private repository: IEventReadRepository,
  ) {}

  /**
   *
   * @param query
   * @returns
   */
  async execute(query: FindEventsByOrganizerIdQuery): Promise<FindEventsByOrganizerIdResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ query });

    const events = await this.repository.findByOrganizerId(query.organizerId, {
      ...omit(query, 'organizerId'),
    });

    const result = new FindEventsByOrganizerIdResult(events);

    this.logger.trace(`END`);
    return result;
  }
}
