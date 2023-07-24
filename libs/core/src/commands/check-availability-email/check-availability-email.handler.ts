import { AUTH_SERVICE } from '@mulailomba/core/constants';
import { IAuthService } from '@mulailomba/core/interfaces';
import { USER_SERVICE } from '@mulailomba/user/constants';
import { UserError } from '@mulailomba/user/errors';
import { IUserService } from '@mulailomba/user/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CheckAvailabilityEmailCommand } from './check-availability-email.command';

@CommandHandler(CheckAvailabilityEmailCommand)
export class CheckAvailabilityEmailHandler
  implements ICommandHandler<CheckAvailabilityEmailCommand, void>
{
  constructor(
    @InjectPinoLogger(CheckAvailabilityEmailHandler.name)
    private readonly logger: PinoLogger,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: CheckAvailabilityEmailCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const user = await this.userService.findByEmail(command.emailAddress);
    if (user) throw new UserError.AlreadyExist();

    await this.authService.sendActivationCode(command.emailAddress);

    this.logger.trace(`END`);
  }
}
