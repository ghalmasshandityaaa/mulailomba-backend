import { Expose } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class VerifyActivationCodeBodyDTO {
  @JoiSchema(
    joi
      .string()
      .pattern(/^[0-9]{6}$/)
      .length(6)
      .required()
      .label('activation_code')
      .messages({
        'string.pattern.base': '"activation_code" must only contains 6 digit numbers (0-9)',
      }),
  )
  @Expose({ name: 'activation_code' })
  readonly activationCode: string;
}
