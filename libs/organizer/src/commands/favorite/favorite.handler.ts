import { ORGANIZER_WRITE_REPOSITORY } from '@mulailomba/organizer/constants';
import { OrganizerError } from '@mulailomba/organizer/errors';
import { IOrganizerWriteRepository } from '@mulailomba/organizer/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { FavoriteCommand } from './favorite.command';

@CommandHandler(FavoriteCommand)
export class FavoriteHandler implements ICommandHandler<FavoriteCommand, void> {
  constructor(
    @InjectPinoLogger(FavoriteHandler.name)
    private readonly logger: PinoLogger,
    @Inject(ORGANIZER_WRITE_REPOSITORY)
    private readonly repository: IOrganizerWriteRepository,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: FavoriteCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const organizer = await this.repository.findById(command.organizerId);
    if (!organizer || organizer.props.userId !== command.userId) {
      throw new OrganizerError.NotFound();
    } else if (organizer.props.isActive) {
      throw new OrganizerError.AlreadyFavorited();
    }

    organizer.favorite();
    await this.repository.update(organizer);

    this.logger.trace(`END`);
  }
}
