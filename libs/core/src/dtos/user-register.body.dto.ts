import { Expose } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class UserRegisterBodyDTO {
  @JoiSchema(joi.string().min(2).max(50).required().label('full_name'))
  @Expose({ name: 'full_name' })
  readonly fullName: string;

  @JoiSchema(
    joi
      .string()
      .pattern(new RegExp('^\\+628[0-9]{9,11}$'))
      .required()
      .label('phone_number')
      .messages({
        'string.pattern.base':
          '"phone_number" must started with +628 and length 9-11 dit of number after the first pattern ex: +62812345678900',
      }),
  )
  @Expose({ name: 'phone_number' })
  readonly phoneNumber: string;

  @JoiSchema(joi.string().min(8).max(16).required().label('password'))
  @Expose({ name: 'password' })
  readonly password: string;
}
