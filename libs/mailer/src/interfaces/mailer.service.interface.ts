import { ActivationCodeContext } from './mailer.context.interface';
import { IMailOptions, IRecipients } from './mailer.interface';

export interface IMailerService {
  send(mailOption: IMailOptions, sendSeparately: boolean): Promise<void>;
  sendActivationCode(mailOption: IRecipients, context: ActivationCodeContext): Promise<void>;
}
