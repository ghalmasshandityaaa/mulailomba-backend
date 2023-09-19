import { ModuleMetadata, Type } from '@nestjs/common';
import { LogLevel, MessageAttachment } from '@slack/web-api';

export interface SlackOptions {
  slackToken: string;
  slackChannel: Record<string, string>;
  slackLogLevel: LogLevel;
}

export const SLACK_OPTIONS = 'slack-options';

export interface SlackOptionsFactory {
  create(): Promise<SlackOptions> | SlackOptions;
}

export interface SlackAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useClass?: Type<SlackOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<SlackOptions> | SlackOptions;
  inject?: any[];
}

export enum SLACK_CHANNEL {
  ERROR_NOTIFICATION = 'ERROR_NOTIFICATION',
}

export interface SendSlackOptions {
  channel: SLACK_CHANNEL;
  title?: string;
  message: string;
  attachments?: MessageAttachment[];
}
