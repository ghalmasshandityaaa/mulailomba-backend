import { DateUtils } from '@mulailomba/common';
import { CategoryQueryModel } from '../interfaces';
import { JsonCategoryProps } from '../interfaces/category.response.interface';

export class JsonCategorySerializer {
  public static serialize(model: CategoryQueryModel): JsonCategoryProps {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      created_at: DateUtils.toUnix(model.createdAt),
      updated_at: DateUtils.toUnix(model.updatedAt),
    };
  }
}
