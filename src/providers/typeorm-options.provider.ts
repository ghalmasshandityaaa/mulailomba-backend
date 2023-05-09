import { DatabaseConfigService } from '@aksesaja/config';
import { TYPEORM_PINO_LOGGER } from '@aksesaja/logger/logger.constants';
import { TypeOrmPinoLoggerProvider } from '@aksesaja/logger/providers/typeorm.pino-logger.provider';
import { TypeOrmOrganizerEntities } from '@aksesaja/organizer/entities';
import { TypeOrmUserEntities } from '@aksesaja/user/entities';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TypeOrmAuthEntities } from 'src/auth/entities';

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
      autoLoadEntities: false,
      entities: [...TypeOrmUserEntities, ...TypeOrmAuthEntities, ...TypeOrmOrganizerEntities],
      synchronize: false,
      logging: true,
      logger: this.logger,
    };
  }
}
