import { BANNER_READ_REPOSITORY } from '@mulailomba/banner/banner.constants';
import { IBannerReadRepository } from '@mulailomba/banner/interfaces';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { FindHomepagesQuery } from './find-homepages.query';
import { FindHomepagesResult } from './find-homepages.result';

@QueryHandler(FindHomepagesQuery)
export class FindHomepagesHandler
  implements IQueryHandler<FindHomepagesQuery, FindHomepagesResult>
{
  constructor(
    @InjectPinoLogger(FindHomepagesHandler.name) private logger: PinoLogger,
    @Inject(BANNER_READ_REPOSITORY)
    private repository: IBannerReadRepository,
  ) {}

  /**
   *
   * @param query
   * @returns
   */
  async execute(query: FindHomepagesQuery): Promise<FindHomepagesResult> {
    this.logger.trace('BEGIN');
    this.logger.info({ query });

    const collection = await this.repository.findAll();
    const result = new FindHomepagesResult(collection);

    this.logger.trace('END');
    return result;
  }
}
