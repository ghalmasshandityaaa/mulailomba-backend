import { IPaginatedQuery, ISearchableQuery, SearchCondition } from '@mulailomba/common';
import { IQuery } from '@nestjs/cqrs';

class Props implements IPaginatedQuery, ISearchableQuery {
  readonly page?: number;
  readonly pageSize?: number;
  readonly searchBy?: SearchCondition[];
}

export class FindCategoriesQuery extends Props implements IQuery {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
