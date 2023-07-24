import { ORGANIZER_SERVICE } from '@mulailomba/organizer/constants';
import { OrganizerError } from '@mulailomba/organizer/errors';
import { IOrganizerService } from '@mulailomba/organizer/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { OrganizerLogoutCommand } from './organizer-logout.command';

@CommandHandler(OrganizerLogoutCommand)
export class OrganizerLogoutHandler implements ICommandHandler<OrganizerLogoutCommand, void> {
  constructor(
    @InjectPinoLogger(OrganizerLogoutHandler.name)
    private readonly logger: PinoLogger,
    @Inject(ORGANIZER_SERVICE)
    private readonly organizerService: IOrganizerService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: OrganizerLogoutCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const organizer = await this.organizerService.findAggregateById(command.id);
    if (!organizer) throw new OrganizerError.NotFound();

    organizer.logout();
    organizer.commit();

    this.logger.trace(`END`);
  }
}
