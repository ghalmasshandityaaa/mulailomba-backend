import { DatabaseConfigService } from '@aksesaja/config';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmOptionsProvider implements TypeOrmOptionsFactory {
  constructor(private config: DatabaseConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      retryAttempts: 3,
      type: 'postgres',
      url: this.config.url,
      autoLoadEntities: false,
      entities: [],
      synchronize: false,
      logging: true,
    };
  }
}