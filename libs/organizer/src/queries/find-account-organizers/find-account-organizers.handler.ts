import { ORGANIZER_READ_REPOSITORY } from '@mulailomba/organizer/constants';
import { IOrganizerReadRepository } from '@mulailomba/organizer/interfaces';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { FindAccountOrganizersQuery } from './find-account-organizers.query';
import { FindAccountOrganizersResult } from './find-account-organizers.result';

@QueryHandler(FindAccountOrganizersQuery)
export class FindAccountOrganizersHandler
  implements IQueryHandler<FindAccountOrganizersQuery, FindAccountOrganizersResult>
{
  constructor(
    @InjectPinoLogger(FindAccountOrganizersHandler.name) private logger: PinoLogger,
    @Inject(ORGANIZER_READ_REPOSITORY)
    private repository: IOrganizerReadRepository,
  ) {}

  /**
   *
   * @param query
   * @returns
   */
  async execute(query: FindAccountOrganizersQuery): Promise<FindAccountOrganizersResult> {
    this.logger.trace('BEGIN');
    this.logger.info({ query });

    const collection = await this.repository.findByUserId(query.userId, { ...query });
    const result = new FindAccountOrganizersResult(collection);

    this.logger.trace('END');
    return result;
  }
}
