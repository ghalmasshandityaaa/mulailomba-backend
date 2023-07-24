import { StringUtils } from '@mulailomba/common';
import { IMailerService } from '@mulailomba/mailer/interfaces';
import { MAILER_SERVICE } from '@mulailomba/mailer/mailer.constant';
import { Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ACTIVATION_CODE_SERVICE } from '../constants';
import { IActivationCodeService, IAuthService } from '../interfaces';

export class AuthService implements IAuthService {
  constructor(
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
    @Inject(MAILER_SERVICE)
    private readonly mailerService: IMailerService,
    @Inject(ACTIVATION_CODE_SERVICE)
    private readonly activationCodeService: IActivationCodeService,
  ) {}

  async sendActivationCode(emailAddress: string): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ emailAddress });

    const activationCode = StringUtils.randomNumber(6);
    await this.activationCodeService.create(emailAddress, activationCode);
    this.logger.info(`activation code was created`);
    await this.mailerService.sendActivationCode({ recipients: [emailAddress] }, activationCode);

    this.logger.trace;
  }
}
