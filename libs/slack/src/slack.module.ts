import { DynamicModule, Module, Provider } from '@nestjs/common';
import { LogLevel, WebClient } from '@slack/web-api';
import { SlackConfigModule, SlackConfigService } from './config';
import { SlackOptions, SLACK_OPTIONS } from './slack.interface';
import { SlackService } from './slack.service';

@Module({})
export class SlackModule {
  static forRoot(options?: SlackOptions): DynamicModule {
    const optionsProvider: Provider<SlackOptions> = {
      provide: SLACK_OPTIONS,
      useFactory: (config: SlackConfigService) => {
        return {
          slackToken: options?.slackToken || config.slackToken,
          slackChannel: options?.slackChannel || JSON.parse(config.slackChannel),
          slackLogLevel: options?.slackLogLevel || config.slackLogLevel || LogLevel.INFO,
        };
      },
      inject: [SlackConfigService],
    };

    return {
      imports: [SlackConfigModule],
      module: SlackModule,
      providers: [optionsProvider, SlackService, WebClient],
      exports: [optionsProvider, SlackService],
    };
  }
}
