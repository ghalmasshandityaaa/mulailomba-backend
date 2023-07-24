import { IAuthService } from '@mulailomba/core/interfaces';
import { USER_SERVICE } from '@mulailomba/user/constants';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ResendActivationCodeCommand } from './resend-activation-code.command';

@CommandHandler(ResendActivationCodeCommand)
export class ResendActivationCodeHandler
  implements ICommandHandler<ResendActivationCodeCommand, void>
{
  constructor(
    @InjectPinoLogger(ResendActivationCodeHandler.name)
    private readonly logger: PinoLogger,
    @Inject(USER_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: ResendActivationCodeCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    await this.authService.sendActivationCode(command.email);

    this.logger.trace(`END`);
  }
}
