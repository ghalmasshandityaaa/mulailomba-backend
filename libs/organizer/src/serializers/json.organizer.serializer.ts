import { DateUtils } from '@mulailomba/common';
import { JsonOrganizerProps, OrganizerQueryModel } from '../interfaces';

export class JsonOrganizerSerializer {
  public static serialize(model: OrganizerQueryModel): JsonOrganizerProps {
    return {
      id: model.id,
      name: model.name,
      profile: model.profile,
      background: model.background,
      email_address: model.emailAddress,
      is_locked: model.isLocked,
      is_active: model.isActive,
      created_at: DateUtils.toUnix(model.createdAt),
      updated_at: DateUtils.toUnix(model.updatedAt),
      user_id: model.userId,
    };
  }
}
