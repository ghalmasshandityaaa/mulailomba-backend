import { StringUtils } from '@mulailomba/common';
import { ACTIVATION_CODE_SERVICE } from '@mulailomba/core/constants';
import { IActivationCodeService } from '@mulailomba/core/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { VerifyUserCommand } from './verify-user.command';

@CommandHandler(VerifyUserCommand)
export class ResendActivationCodeHandler implements ICommandHandler<VerifyUserCommand, void> {
  constructor(
    @InjectPinoLogger(ResendActivationCodeHandler.name)
    private readonly logger: PinoLogger,
    @Inject(ACTIVATION_CODE_SERVICE)
    private readonly service: IActivationCodeService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: VerifyUserCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const [email, code] = StringUtils.decrypt(command.id).split(':');
    await this.service.verify(email, code);

    this.logger.trace(`END`);
  }
}
