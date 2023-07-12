import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateEventCommand } from './create-event.command';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand, void> {
  constructor(@InjectPinoLogger(CreateEventHandler.name) private logger: PinoLogger) {}

  /**
   *
   * @param command
   */
  async execute(command: CreateEventCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    this.logger.trace(`END`);
  }
}
