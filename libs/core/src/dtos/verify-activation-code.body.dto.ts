import { Expose } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class VerifyAccountBodyDTO {
  @JoiSchema(joi.string().required())
  @Expose({ name: 'id' })
  readonly id: string;
}
