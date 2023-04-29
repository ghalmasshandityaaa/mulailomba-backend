export interface IRecipients {
  recipients: string[];
  cc?: string[];
  bcc?: string[];
}

export interface IMailOptions extends IRecipients {
  subject: string;
  template: string;
  attachments?: IAttachment[];
}

interface IAttachment {
  filename: string;
  content?: any;
  path?: string;
  contentType?: string;
  cid?: string;
}
