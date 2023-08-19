import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class PublishEventBodyDTO {
  @JoiSchema(joi.string().uuid().required())
  readonly id: string;
}
