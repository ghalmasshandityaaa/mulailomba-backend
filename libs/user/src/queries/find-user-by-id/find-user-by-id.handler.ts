import { USER_READ_REPOSITORY } from '@mulailomba/user/constants';
import { UserError } from '@mulailomba/user/errors';
import { IUserReadRepository } from '@mulailomba/user/interfaces';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { FindUserByIdQuery } from './find-user-by-id.query';
import { FindUserByIdResult } from './find-user-by-id.result';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery, FindUserByIdResult> {
  constructor(
    @InjectPinoLogger(FindUserByIdHandler.name)
    private logger: PinoLogger,
    @Inject(USER_READ_REPOSITORY)
    private repository: IUserReadRepository,
  ) {}

  /**
   *
   * @param query
   * @returns
   */
  async execute(query: FindUserByIdQuery): Promise<FindUserByIdResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ query });

    const user = await this.repository.findById(query.userId);
    if (!user) throw new UserError.NotFound();

    const result = new FindUserByIdResult(user);

    this.logger.trace(`END`);
    return result;
  }
}
