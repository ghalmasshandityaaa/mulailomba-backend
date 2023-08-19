import { CategoryQueryModel } from './category.query-model.interface';

export interface ICategoryService {
  findById(id: string): Promise<CategoryQueryModel | undefined>;
}
