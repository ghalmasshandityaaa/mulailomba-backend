import { Transform } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';
import { FILE_TOPIC_TYPE } from '../file.constants';

export class UploadFileBodyDTO {
  @JoiSchema(
    joi
      .string()
      .trim()
      .uppercase()
      .valid('UPLOADS', 'POSTER', 'PROFILES', 'BANNERS', 'TIMELINES')
      .optional()
      .default('UPLOADS')
      .label('topic'),
  )
  @Transform(({ value }) => value as FILE_TOPIC_TYPE)
  readonly topic: FILE_TOPIC_TYPE;
}
