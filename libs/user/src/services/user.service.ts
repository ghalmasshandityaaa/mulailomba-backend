import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { USER_READ_REPOSITORY, USER_WRITE_REPOSITORY } from '../constants';
import { CreateUserProps, UserAggregate } from '../domains';
import {
  IUserReadRepository,
  IUserService,
  IUserWriteRepository,
  UserQueryModel,
} from '../interfaces';

export class UserService implements IUserService {
  constructor(
    @InjectPinoLogger(UserService.name)
    private logger: PinoLogger,
    @Inject(USER_READ_REPOSITORY)
    private readonly repository: IUserReadRepository,
    @Inject(USER_WRITE_REPOSITORY)
    private readonly writeRepository: IUserWriteRepository,
    private readonly publisher: EventPublisher,
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

  async create(props: CreateUserProps): Promise<UserAggregate> {
    const entity = this.publisher.mergeObjectContext(UserAggregate.create({ ...props }));
    await this.writeRepository.create(entity);
    return entity;
  }
}
