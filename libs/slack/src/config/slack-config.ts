import { registerAs } from '@nestjs/config';
import { LogLevel } from '@slack/web-api';
import { SlackConfig } from './slack-config.interface';

export default registerAs<SlackConfig>('slack', () => ({
  slackToken: process.env.SLACK_TOKEN,
  slackChannel: process.env.SLACK_CHANNEL,
  slackLogLevel: (process.env.SLACK_LOG_LEVEL || LogLevel.INFO) as LogLevel,
}));
