import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import config from './config';

@Injectable()
export class CloudinaryConfigService {
  private config: ConfigType<typeof config>;
  constructor(private configService: ConfigService) {
    const conf = this.configService.getOrThrow('cloudinary');
    this.config = conf;
  }

  get dryRun(): boolean | undefined {
    if (!this.config.dryRun) {
      return undefined;
    }

    return this.config.dryRun === '1';
  }

  get cloudName(): string | undefined {
    return this.config.cloudName;
  }

  get apiKey(): string | undefined {
    return this.config.apiKey;
  }

  get apiSecret(): string | undefined {
    return this.config.apiSecret;
  }
}
