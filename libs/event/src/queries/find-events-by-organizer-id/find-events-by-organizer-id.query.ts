import {
  FilterCondition,
  IFilterableQuery,
  IPaginatedQuery,
  ISearchableQuery,
  ISortableQuery,
  SearchCondition,
  SortCondition,
} from '@mulailomba/common';
import { IQuery } from '@nestjs/cqrs';

class Props implements IPaginatedQuery, ISortableQuery, IFilterableQuery, ISearchableQuery {
  readonly organizerId: string;
  readonly page?: number;
  readonly pageSize?: number;
  readonly sortBy?: SortCondition[];
  readonly filterBy?: FilterCondition<any>[];
  readonly searchBy?: SearchCondition[];
}

export class FindEventsByOrganizerIdQuery extends Props implements IQuery {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
