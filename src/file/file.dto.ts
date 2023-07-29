import { Transform } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export type FILE_TOPIC_TYPE = 'UPLOADS' | 'POSTER' | 'PROFILES' | 'BANNERS' | 'TIMELINES';
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
  @Transform(({ value }) => value.toUpperCase())
  readonly topic: string;
}
