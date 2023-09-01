import {
  DatabaseConfigModule,
  DatabaseConfigService,
  LoggerConfigModule,
  LoggerConfigService,
} from '@mulailomba/config';
import { TypeOrmOptionsProvider } from '@mulailomba/database/config';
import { LoggerModule } from '@mulailomba/logger';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useClass: TypeOrmOptionsProvider,
      inject: [DatabaseConfigService],
    }),
    LoggerModule.forRootAsync({
      imports: [LoggerConfigModule],
      useFactory: (config: LoggerConfigService) => ({
        level: config.level,
        excludePath: ['health'],
      }),
      inject: [LoggerConfigService],
    }),
  ],
})
export class AppModule {}
