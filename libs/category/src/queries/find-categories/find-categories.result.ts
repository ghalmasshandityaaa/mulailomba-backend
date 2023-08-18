import { CategoryQueryModel } from '@mulailomba/category/interfaces';
import { JsonCategoryProps } from '@mulailomba/category/interfaces/category.response.interface';
import { JsonCategorySerializer } from '@mulailomba/category/serializers';
import { PaginatedCollection } from '@mulailomba/common';
import { PaginatedQueryResult } from '@mulailomba/common/queries';

export class FindCategoriesResult extends PaginatedQueryResult<CategoryQueryModel> {
  readonly categories: JsonCategoryProps[];

  constructor(collections: PaginatedCollection<CategoryQueryModel>) {
    super(collections);
    this.categories = collections.data.map((c) => JsonCategorySerializer.serialize(c));
  }
}
