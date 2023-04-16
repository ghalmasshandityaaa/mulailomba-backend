import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerConfig } from './logger-config.interface';

@Injectable()
export class LoggerConfigService implements LoggerConfig {
  constructor(private config: ConfigService) {}

  get level() {
    return this.config.getOrThrow('LOG_LEVEL');
  }
}
