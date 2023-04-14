import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CorsConfig, ServerConfig } from './server-config.interface';

@Injectable()
export class ServerConfigService implements ServerConfig {
  constructor(private config: ConfigService) {}

  get port(): number {
    return parseInt(this.config.getOrThrow('PORT'), 10);
  }

  get cors(): CorsConfig {
    return {
      origin: this.config.getOrThrow('CORS_ORIGIN'),
    };
  }
}
