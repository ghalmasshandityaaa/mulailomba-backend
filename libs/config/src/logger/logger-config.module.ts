import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerConfigService } from './logger-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema: Joi.object({
        LOG_LEVEL: Joi.string()
          .default('info')
          .valid('trace', 'debug', 'info', 'warn', 'fatal')
          .optional(),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
  ],
  providers: [LoggerConfigService],
  exports: [LoggerConfigService],
})
export class LoggerConfigModule {}
