import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class CreateEventBodyDTO {
  @JoiSchema(joi.string().min(4).max(25).required())
  readonly name: string;
}
