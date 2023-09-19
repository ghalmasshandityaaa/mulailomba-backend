import { LogLevel } from '@slack/web-api';

export interface SlackConfig {
  slackToken: string | undefined;
  slackChannel: string | undefined;
  slackLogLevel: LogLevel;
}
