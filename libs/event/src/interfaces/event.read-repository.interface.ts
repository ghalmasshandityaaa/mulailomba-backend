import {
  IFilterableQuery,
  IPaginatedQuery,
  ISearchableQuery,
  ISortableQuery,
  PaginatedCollection,
} from '@mulailomba/common';
import { EventQueryModel } from './event.query-model.interface';

export interface IEventReadRepository {
  findByOrganizerId(
    organizerId: string,
    params: IPaginatedQuery & ISortableQuery & IFilterableQuery & ISearchableQuery,
  ): Promise<PaginatedCollection<EventQueryModel>>;
}
