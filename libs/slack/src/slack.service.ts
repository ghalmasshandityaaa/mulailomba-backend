import { Inject, Injectable } from '@nestjs/common';
import { ErrorCode, WebClient } from '@slack/web-api';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { SlackConfigService } from './config';
import { SlackError } from './errors';
import { SendSlackOptions, SlackOptions, SLACK_CHANNEL, SLACK_OPTIONS } from './slack.interface';

@Injectable()
export class SlackService {
  constructor(
    @InjectPinoLogger(SlackService.name)
    private readonly logger: PinoLogger,
    @Inject(SLACK_OPTIONS)
    private readonly options: SlackOptions,
    private readonly config: SlackConfigService,
    private readonly slack: WebClient,
  ) {
    this.slack = new WebClient(this.options.slackToken, {
      logLevel: this.options.slackLogLevel,
    });
  }

  async send(options: SendSlackOptions): Promise<void> {
    const method = 'send';
    this.logger.trace({ method }, `BEGIN`);

    const { channel, message, title, attachments = [] } = options;

    const channelId = this.configureChannel(channel);
    this.logger.debug(`Channel ID successfully found`, { channelId });

    try {
      const response = this.slack.chat.postMessage({
        channel: channelId,
        text: title ? `*${title}* \n\n${message}` : message,
        attachments,
      });

      this.logger.debug(`Successfully send message to: ${channelId}.`, {
        response,
      });
    } catch (error) {
      let message = `Unexpected error while sending message to: ${channelId}.`;
      if (error.code === ErrorCode.PlatformError) {
        message = `Failed to send message to: ${channelId}.`;
      }

      this.logger.error(message, {
        message: error.message,
        data: error.data,
      });
    }

    this.logger.trace({ method }, `END`);
  }

  private configureChannel(channel: SLACK_CHANNEL): string {
    const method = 'configureChannel';
    this.logger.trace({ method }, `BEGIN`);

    const channelId = this.config.slackChannels[channel];
    if (!channelId) throw new SlackError.ChannelNotFound();

    this.logger.trace({ method }, `END`);
    return channelId;
  }
}
