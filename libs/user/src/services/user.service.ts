import { Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { USER_READ_REPOSITORY } from '../constants';
import { IUserReadRepository, IUserService, UserQueryModel } from '../interfaces';

export class UserService implements IUserService {
  constructor(
    @InjectPinoLogger(UserService.name)
    private logger: PinoLogger,
    @Inject(USER_READ_REPOSITORY)
    private readonly repository: IUserReadRepository,
  ) {}

  async findById(id: string): Promise<UserQueryModel | undefined> {
    this.logger.trace('BEGIN');
    this.logger.info({ id });

    const user = await this.repository.findById(id);

    this.logger.trace('END');
    return user;
  }

  async findByEmail(emailAddress: string): Promise<UserQueryModel | undefined> {
    this.logger.trace('BEGIN');
    this.logger.info({ emailAddress });

    const user = await this.repository.findByEmail(emailAddress);

    this.logger.trace('END');
    return user;
  }
}
