import { Expose } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class OrganizerRegisterBodyDTO {
  @JoiSchema(joi.string().min(2).max(50).required().label('name'))
  @Expose({ name: 'name' })
  readonly name: string;

  @JoiSchema(joi.string().email().required().label('email'))
  @Expose({ name: 'email' })
  readonly emailAddress: string;

  @JoiSchema(joi.boolean().required().label('is_locked'))
  @Expose({ name: 'is_locked' })
  readonly isLocked: boolean;

  @JoiSchema(
    joi
      .string()
      .when('isLocked', {
        is: true,
        then: joi.required(),
        otherwise: joi.optional().allow(null),
      })
      .min(8)
      .max(16)
      .required()
      .label('password'),
  )
  @Expose({ name: 'password' })
  readonly password: string;
}
