import { Expose } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class UserLoginBodyDTO {
  @JoiSchema(joi.string().email().required().label('email'))
  @Expose({ name: 'email' })
  readonly emailAddress: string;

  @JoiSchema(joi.string().min(8).max(16).required().label('password'))
  @Expose({ name: 'password' })
  readonly password: string;
}
