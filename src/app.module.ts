import { RequestIdInterceptor, ResponseEnvelopeInterceptor } from '@aksesaja/common';
import {
  DatabaseConfigModule,
  DatabaseConfigService,
  LoggerConfigModule,
  LoggerConfigService,
  ServerConfigModule,
} from '@aksesaja/config';
import { LoggerModule } from '@aksesaja/logger';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health';
import { TypeOrmOptionsProvider } from './providers';

@Module({
  imports: [
    CqrsModule,
    ServerConfigModule,
    HealthModule.forRoot(),
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
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestIdInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseEnvelopeInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
