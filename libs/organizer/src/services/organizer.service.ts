import { Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ORGANIZER_READ_REPOSITORY, ORGANIZER_WRITE_REPOSITORY } from '../constants';
import { CreateOrganizerProps, OrganizerEntity } from '../domains';
import {
  IOrganizerReadRepository,
  IOrganizerService,
  IOrganizerWriteRepository,
  OrganizerQueryModel,
} from '../interfaces';

export class OrganizerService implements IOrganizerService {
  constructor(
    @InjectPinoLogger(OrganizerService.name)
    private logger: PinoLogger,
    @Inject(ORGANIZER_READ_REPOSITORY)
    private readonly repository: IOrganizerReadRepository,
    @Inject(ORGANIZER_WRITE_REPOSITORY)
    private readonly writeRepository: IOrganizerWriteRepository,
  ) {}

  async findById(id: string, userId: string): Promise<OrganizerQueryModel | undefined> {
    this.logger.trace('BEGIN');
    this.logger.info({ id, userId });

    const organizer = await this.repository.findById(id, userId);

    this.logger.trace('END');
    return organizer;
  }

  async findByEmail(email: string): Promise<OrganizerQueryModel | undefined> {
    this.logger.trace('BEGIN');
    this.logger.info({ email });

    const organizer = await this.repository.findByEmail(email);

    this.logger.trace('END');
    return organizer;
  }

  async create(props: CreateOrganizerProps): Promise<void> {
    this.logger.trace('BEGIN');
    this.logger.info({ props });

    const entity = OrganizerEntity.create({ ...props });
    await this.writeRepository.create(entity);

    this.logger.trace('END');
  }
}
