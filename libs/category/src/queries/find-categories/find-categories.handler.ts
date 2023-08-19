import { CATEGORY_READ_REPOSITORY } from '@mulailomba/category/category.constants';
import { ICategoryReadRepository } from '@mulailomba/category/interfaces';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { FindCategoriesQuery } from './find-categories.query';
import { FindCategoriesResult } from './find-categories.result';

@QueryHandler(FindCategoriesQuery)
export class FindCategoriesHandler
  implements IQueryHandler<FindCategoriesQuery, FindCategoriesResult>
{
  constructor(
    @InjectPinoLogger(FindCategoriesHandler.name) private logger: PinoLogger,
    @Inject(CATEGORY_READ_REPOSITORY)
    private repository: ICategoryReadRepository,
  ) {}

  /**
   *
   * @param query
   * @returns
   */
  async execute(query: FindCategoriesQuery): Promise<FindCategoriesResult> {
    this.logger.trace('BEGIN');
    this.logger.info({ query });

    const collection = await this.repository.findAll({ ...query });
    const result = new FindCategoriesResult(collection);

    this.logger.trace('END');
    return result;
  }
}
