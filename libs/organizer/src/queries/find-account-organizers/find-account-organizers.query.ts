import {
  ISearchableQuery,
  ISortableQuery,
  SearchCondition,
  SortCondition,
} from '@mulailomba/common';
import { IQuery } from '@nestjs/cqrs';

class Props implements ISearchableQuery, ISortableQuery {
  readonly userId: string;
  readonly searchBy?: SearchCondition[];
  readonly sortBy?: SortCondition[];
}

export class FindAccountOrganizersQuery extends Props implements IQuery {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
