import { StringUtils, TemplateUtils } from '@mulailomba/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { IMailerService, IMailOptions, IRecipients } from '../interfaces';
import { EmailTemplates } from '../mailer.template';

export class MailerService implements IMailerService {
  private APP_DOMAIN: string;

  constructor(
    @InjectPinoLogger(MailerService.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.APP_DOMAIN = this.configService.get<string>('APP_DOMAIN') || 'mulailomba.com';
  }

  async send(mailOption: IMailOptions, sendSeparately = false): Promise<void> {
    const method = 'send';
    this.logger.trace({ method }, 'BEGIN');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: this.configService.get<string>('MAIL_HOST'),
      auth: {
        user: this.configService.get<string>('MAIL_USERNAME'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      if (sendSeparately) {
        mailOption.recipients.forEach((to) => {
          const mailOptions: Mail.Options = {
            from: `MulaiLomba Official < ${this.configService.get<string>('MAIL_USERNAME')} >`,
            to,
            cc: mailOption.cc,
            bcc: mailOption.bcc,
            subject: mailOption.subject,
            attachments: mailOption.attachments,
            html: mailOption.template,
          };

          transporter.sendMail(mailOptions);
        });
      } else {
        const mailOptions: Mail.Options = {
          from: `MulaiLomba Official < ${this.configService.get<string>('MAIL_USER')} >`,
          to: mailOption.recipients,
          cc: mailOption.cc,
          bcc: mailOption.bcc,
          subject: mailOption.subject,
          attachments: mailOption.attachments,
          html: mailOption.template,
        };

        transporter.sendMail(mailOptions);
      }
    } catch (err) {
      this.logger.error(
        {
          error: {
            code: err.code,
            message: err.message,
            recipients: mailOption.recipients,
            cc: mailOption.cc,
            bcc: mailOption.bcc,
          },
        },
        `unable to send email`,
      );
      throw err;
    }

    this.logger.trace({ method }, 'END');
  }

  async sendActivationCode(recipients: IRecipients, activationCode: string): Promise<void> {
    const title = 'Activation Code';
    const uniqueId = `${recipients.recipients.join(',')}:${activationCode}`;
    const idVerification = StringUtils.encrypt(uniqueId);
    const template = TemplateUtils.compile(EmailTemplates.ACTIVATION_CODE, {
      url: `${this.APP_DOMAIN}/validate-registration?id=${idVerification}`,
    });

    const mailOption: IMailOptions = {
      subject: title,
      template,
      ...recipients,
    };

    this.send(mailOption);
  }
}
