import { DateUtils } from '@mulailomba/common';
import { JsonOrganizerProps, OrganizerQueryModel } from '../interfaces';

export class JsonOrganizerSerializer {
  public static serialize(model: OrganizerQueryModel): JsonOrganizerProps {
    return {
      id: model.id,
      name: model.name,
      username: model.username,
      profile: model.profile ?? null,
      background: model.background ?? null,
      email_address: model.emailAddress,
      is_locked: model.isLocked,
      is_active: model.isActive,
      is_favorite: model.isFavorite,
      created_at: DateUtils.toUnix(model.createdAt),
      updated_at: DateUtils.toUnix(model.updatedAt),
      logout_at: model.logoutAt ? DateUtils.toUnix(model.logoutAt) : null,
      user_id: model.userId,
    };
  }
}
