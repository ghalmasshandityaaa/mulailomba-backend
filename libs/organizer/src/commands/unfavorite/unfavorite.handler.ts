import { ORGANIZER_WRITE_REPOSITORY } from '@mulailomba/organizer/constants';
import { OrganizerError } from '@mulailomba/organizer/errors';
import { IOrganizerWriteRepository } from '@mulailomba/organizer/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UnfavoriteCommand } from './unfavorite.command';

@CommandHandler(UnfavoriteCommand)
export class UnfavoriteHandler implements ICommandHandler<UnfavoriteCommand, void> {
  constructor(
    @InjectPinoLogger(UnfavoriteHandler.name)
    private readonly logger: PinoLogger,
    @Inject(ORGANIZER_WRITE_REPOSITORY)
    private readonly repository: IOrganizerWriteRepository,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: UnfavoriteCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const organizer = await this.repository.findById(command.organizerId);
    console.log(1, organizer);
    if (!organizer || organizer.props.userId !== command.userId) {
      throw new OrganizerError.NotFound();
    } else if (!organizer.props.isFavorite) {
      throw new OrganizerError.NotFavorited();
    }

    organizer.unfavorite();
    await this.repository.update(organizer);

    this.logger.trace(`END`);
  }
}
