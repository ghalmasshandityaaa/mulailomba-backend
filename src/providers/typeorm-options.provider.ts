import { DatabaseConfigService } from '@mulailomba/config';
import { TYPEORM_PINO_LOGGER } from '@mulailomba/logger/logger.constants';
import { TypeOrmPinoLoggerProvider } from '@mulailomba/logger/providers/typeorm.pino-logger.provider';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmOptionsProvider implements TypeOrmOptionsFactory {
  constructor(
    private config: DatabaseConfigService,
    @Inject(TYPEORM_PINO_LOGGER)
    private logger: TypeOrmPinoLoggerProvider,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      retryAttempts: 3,
      type: 'postgres',
      url: this.config.url,
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      logger: this.logger,
    };
  }
}
