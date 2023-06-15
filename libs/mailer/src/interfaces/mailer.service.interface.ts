import { IMailOptions, IRecipients } from './mailer.interface';

export interface IMailerService {
  send(mailOption: IMailOptions, sendSeparately: boolean): Promise<void>;
  sendActivationCode(mailOption: IRecipients, activationCode: string): Promise<void>;
}
