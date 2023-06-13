import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ServerConfigService } from './server-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        PORT: Joi.number(),
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
