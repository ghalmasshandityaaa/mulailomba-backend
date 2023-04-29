import { TemplateUtils } from '@aksesaja/common';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ActivationCodeContext, IMailerService, IMailOptions, IRecipients } from '../interfaces';
import { EmailTemplates } from '../mailer.template';

export class MailerService implements IMailerService {
  constructor(
    @InjectPinoLogger(MailerService.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {}

  async send(mailOption: IMailOptions, sendSeparately = false): Promise<void> {
    const method = 'send';
    this.logger.trace({ method }, 'BEGIN');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
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
            from: `Aksesaja Official < ${this.configService.get<string>('MAIL_USERNAME')} >`,
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
          from: `Aksesaja Official < ${this.configService.get<string>('MAIL_USER')} >`,
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

  async sendActivationCode(recipients: IRecipients, context: ActivationCodeContext): Promise<void> {
    const title = 'Activation Code';
    const template = TemplateUtils.compile<ActivationCodeContext>(EmailTemplates.ACTIVATION_CODE, {
      ...context,
      title,
    });

    const mailOption: IMailOptions = {
      subject: title,
      template,
      ...recipients,
    };

    this.send(mailOption);
  }
}
