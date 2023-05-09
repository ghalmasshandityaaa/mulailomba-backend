import { Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ORGANIZER_READ_REPOSITORY } from '../constants';
import { IOrganizerReadRepository, IOrganizerService, OrganizerQueryModel } from '../interfaces';

export class OrganizerService implements IOrganizerService {
  constructor(
    @InjectPinoLogger(OrganizerService.name)
    private logger: PinoLogger,
    @Inject(ORGANIZER_READ_REPOSITORY)
    private readonly repository: IOrganizerReadRepository,
  ) {}

  async findById(id: string, userId: string): Promise<OrganizerQueryModel | undefined> {
    this.logger.trace('BEGIN');
    this.logger.info({ id, userId });

    const organizer = await this.repository.findById(id, userId);

    this.logger.trace('END');
    return organizer;
  }
}
