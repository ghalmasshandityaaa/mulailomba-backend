import {
  IPaginatedQuery,
  ISearchableQuery,
  QueryStringUtils,
  SearchCondition,
} from '@mulailomba/common';
import { Expose, Transform } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class FindCategoriesQueryDTO implements IPaginatedQuery, ISearchableQuery {
  @JoiSchema(joi.number().integer().positive().optional().default(1))
  readonly page?: number;

  @JoiSchema(joi.number().integer().positive().optional().default(10).label('page_size'))
  @Expose({ name: 'page_size' })
  readonly pageSize?: number;

  @Expose({ name: 'search' })
  @JoiSchema(joi.array().optional().label('search'))
  @Transform(({ value }) => QueryStringUtils.parseSearchCondition(value))
  readonly searchBy?: SearchCondition[];
}
