import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import config from './config';
import { CloudinaryConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: Joi.object({
        DRY_RUN: Joi.string().optional().valid('1', '0', '').default(''),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
  ],
  providers: [ConfigService, CloudinaryConfigService],
  exports: [ConfigService, CloudinaryConfigService],
})
export class CloudinaryConfigModule {}
