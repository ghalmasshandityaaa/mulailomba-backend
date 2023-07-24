import { Expose } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class CheckAvailabilityEmailBodyDTO {
  @JoiSchema(joi.string().email().required().label('email'))
  @Expose({ name: 'email' })
  readonly emailAddress: string;
}
