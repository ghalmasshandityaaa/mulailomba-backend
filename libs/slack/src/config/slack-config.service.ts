import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@slack/web-api';
import { SlackConfig } from './slack-config.interface';

@Injectable()
export class SlackConfigService implements SlackConfig {
  constructor(private config: ConfigService) {}

  get slackToken(): string {
    return this.config.getOrThrow('SLACK_TOKEN');
  }

  get slackChannel(): string {
    return this.config.getOrThrow('SLACK_CHANNEL');
  }

  get slackChannels(): Record<string, string> {
    // eg. {"DEFAULT_CHANNEL_KEY":"DEFAULT_CHANNEL_ID"}
    const channels = this.config.getOrThrow('SLACK_CHANNEL');
    return JSON.parse(channels);
  }

  get slackLogLevel(): LogLevel {
    return this.config.get('SLACK_LOG_LEVEL') || LogLevel.INFO;
  }
}
