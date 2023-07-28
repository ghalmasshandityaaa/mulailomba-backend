import { Transform } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class UploadFileBodyDTO {
  @JoiSchema(joi.string().trim().optional().default('UPLOADS').label('topic'))
  @Transform(({ value }) => value.toUpperCase())
  readonly topic: string;
}
