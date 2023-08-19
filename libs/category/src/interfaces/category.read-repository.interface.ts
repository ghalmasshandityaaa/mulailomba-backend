import { IPaginatedQuery, ISearchableQuery, PaginatedCollection } from '@mulailomba/common';
import { CategoryQueryModel } from './category.query-model.interface';

export interface ICategoryReadRepository {
  /**
   *
   * @param id
   * @returns
   */
  findById(id: string): Promise<CategoryQueryModel | undefined>;
  /**
   *
   * @param {IPaginatedQuery & ISearchableQuery}
   * @returns
   */
  findAll(
    params: IPaginatedQuery & ISearchableQuery,
  ): Promise<PaginatedCollection<CategoryQueryModel>>;
}
