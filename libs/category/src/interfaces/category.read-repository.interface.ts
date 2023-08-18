import { CategoryQueryModel } from './category.query-model.interface';

export interface ICategoryReadRepository {
  /**
   *
   * @param id
   * @returns
   */
  findById(id: string): Promise<CategoryQueryModel | undefined>;
}
