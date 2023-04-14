import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseConfigService } from './database-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema: Joi.object({
        PG_DATABASE_URL: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
  ],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseConfigModule {}
