import { DateUtils } from '@mulailomba/common';
import { BannerQueryModel, JsonBannerProps } from '../interfaces';

export class JsonBannerSerializer {
  public static serialize(model: BannerQueryModel): JsonBannerProps {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      position: model.position,
      file: model.file,
      start_date: DateUtils.toUnix(model.startDate),
      end_date: DateUtils.toUnix(model.endDate),
      status: model.status,
      created_by: model.createdBy,
      updated_by: model.updatedBy,
      created_at: DateUtils.toUnix(model.createdAt),
      updated_at: DateUtils.toUnix(model.updatedAt),
    };
  }
}
