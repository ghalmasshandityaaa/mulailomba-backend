import { DateUtils } from '@mulailomba/common';
import { JsonUserProps, UserQueryModel } from '../interfaces';

export class JsonUserSerializer {
  public static serialize(model: UserQueryModel): JsonUserProps {
    return {
      id: model.id,
      full_name: model.fullName,
      email_address: model.emailAddress,
      phone_number: model.phone,
      is_active: model.isActive,
      created_at: DateUtils.toUnix(model.createdAt),
      updated_at: DateUtils.toUnix(model.updatedAt),
    };
  }
}
