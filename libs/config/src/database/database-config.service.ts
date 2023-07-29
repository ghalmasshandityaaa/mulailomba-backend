import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './database-config.interface';

@Injectable()
export class DatabaseConfigService implements DatabaseConfig {
  constructor(private config: ConfigService) {}

  get url() {
    return this.config.getOrThrow('PG_DATABASE_URL');
  }

  get ssl() {
    return this.config.getOrThrow('PG_DATABASE_SSL') === 'true';
  }
}
