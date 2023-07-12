import { ORGANIZER_READ_REPOSITORY } from '@mulailomba/organizer/constants';
import { OrganizerError } from '@mulailomba/organizer/errors';
import { IOrganizerReadRepository } from '@mulailomba/organizer/interfaces';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { FindOrganizerQuery } from './find-organizer.query';
import { FindOrganizerResult } from './find-organizer.result';

@QueryHandler(FindOrganizerQuery)
export class FindOrganizerHandler
  implements IQueryHandler<FindOrganizerQuery, FindOrganizerResult>
{
  constructor(
    @InjectPinoLogger(FindOrganizerHandler.name) private logger: PinoLogger,
    @Inject(ORGANIZER_READ_REPOSITORY)
    private repository: IOrganizerReadRepository,
  ) {}

  /**
   *
   * @param query
   * @returns
   */
  async execute(query: FindOrganizerQuery): Promise<FindOrganizerResult> {
    this.logger.trace('BEGIN');
    this.logger.info({ query });

    const organizer = await this.repository.findById(query.id);
    if (!organizer) throw new OrganizerError.NotFound();
    const result = new FindOrganizerResult(organizer);

    this.logger.trace('END');
    return result;
  }
}
