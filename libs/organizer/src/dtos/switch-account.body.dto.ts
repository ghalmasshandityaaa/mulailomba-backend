import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class SwitchAccountBodyDTO {
  @JoiSchema(joi.string().uuid().required())
  readonly id: string;

  @JoiSchema(joi.string().min(8).max(16).allow('', null).optional())
  readonly password?: string;
}
