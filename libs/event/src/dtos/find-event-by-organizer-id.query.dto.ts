import {
  FilterCondition,
  IFilterableQuery,
  IPaginatedQuery,
  ISearchableQuery,
  ISortableQuery,
  QueryStringUtils,
  SearchCondition,
  SortCondition,
} from '@mulailomba/common';
import { Expose, Transform } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class FindEventByOrganizerIdQueryDTO
  implements IPaginatedQuery, ISearchableQuery, IFilterableQuery, ISortableQuery
{
  @JoiSchema(joi.number().integer().positive().optional().default(1))
  readonly page?: number;

  @JoiSchema(joi.number().integer().positive().optional().default(10).label('page_size'))
  @Expose({ name: 'page_size' })
  readonly pageSize?: number;

  @Expose({ name: 'search' })
  @JoiSchema(joi.array().optional().label('search'))
  @Transform(({ value }) => QueryStringUtils.parseSearchCondition(value))
  readonly searchBy?: SearchCondition[];

  @Expose({ name: 'filter' })
  @JoiSchema(joi.array().optional().label('filter'))
  @Transform(({ value }) => QueryStringUtils.parseFilterCondition(value))
  readonly filterBy?: FilterCondition<any>[];

  @JoiSchema(joi.array().optional().label('sort'))
  @Transform(({ value }) => QueryStringUtils.parseSortCondition(value))
  @Expose({ name: 'sort' })
  readonly sortBy?: SortCondition[];
}
