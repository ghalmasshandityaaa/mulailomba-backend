import { ORGANIZER_SERVICE } from '@mulailomba/organizer/constants';
import { OrganizerError } from '@mulailomba/organizer/errors';
import { IOrganizerService } from '@mulailomba/organizer/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RegisterOrganizerCommand } from './register-organizer.command';

@CommandHandler(RegisterOrganizerCommand)
export class RegisterOrganizerCodeHandler
  implements ICommandHandler<RegisterOrganizerCommand, void>
{
  constructor(
    @InjectPinoLogger(RegisterOrganizerCodeHandler.name)
    private readonly logger: PinoLogger,
    @Inject(ORGANIZER_SERVICE)
    private readonly organizerService: IOrganizerService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: RegisterOrganizerCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const organizer = await this.organizerService.findByEmail(command.emailAddress);
    if (organizer) throw new OrganizerError.EmailTaken();

    await this.organizerService.create({ ...command });

    this.logger.trace(`END`);
  }
}
