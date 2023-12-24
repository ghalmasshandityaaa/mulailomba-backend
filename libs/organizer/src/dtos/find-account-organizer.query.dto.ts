import {
  ISearchableQuery,
  ISortableQuery,
  QueryStringUtils,
  SearchCondition,
  SortCondition,
} from '@mulailomba/common';
import { Expose, Transform } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class FindAccountOrganizersQueryDTO implements ISearchableQuery, ISortableQuery {
  @Expose({ name: 'search' })
  @JoiSchema(joi.array().optional().label('search'))
  @Transform(({ value }) => QueryStringUtils.parseSearchCondition(value))
  readonly searchBy?: SearchCondition[];

  @JoiSchema(joi.array().optional().label('sort'))
  @Transform(({ value }) => QueryStringUtils.parseSortCondition(value))
  @Expose({ name: 'sort' })
  readonly sortBy?: SortCondition[];
}
