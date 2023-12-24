import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MinioConfigService } from './minio.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validationSchema: Joi.object({
        MINIO_ENDPOINT: Joi.string().default('127.0.0.1'),
        MINIO_PORT: Joi.number().default(9000),
        MINIO_SSL: Joi.boolean().default(false),
        MINIO_ACCESS_KEY: Joi.string().default(''),
        MINIO_PRIVATE_KEY: Joi.string().default(''),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
  ],
  providers: [MinioConfigService],
  exports: [MinioConfigService],
})
export class MinioConfigModule {}
