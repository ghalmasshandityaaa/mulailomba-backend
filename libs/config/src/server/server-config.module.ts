import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ServerConfigService } from './server-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        CORS_ORIGIN: Joi.string().default('*'),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
  ],
  providers: [ServerConfigService],
  exports: [ServerConfigService],
})
export class ServerConfigModule {}
