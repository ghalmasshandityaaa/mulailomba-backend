import { Expose } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class OrganizerLoginBodyDTO {
  @JoiSchema(joi.string().uuid().optional().label('id'))
  @Expose({ name: 'id' })
  readonly id: string;

  @JoiSchema(joi.string().min(8).max(16).optional().label('password'))
  @Expose({ name: 'password' })
  readonly password?: string;
}
