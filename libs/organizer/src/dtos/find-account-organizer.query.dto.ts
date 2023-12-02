import { ISearchableQuery, QueryStringUtils, SearchCondition } from '@mulailomba/common';
import { Expose, Transform } from 'class-transformer';
import * as joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';

export class FindAccountOrganizersQueryDTO implements ISearchableQuery {
  @Expose({ name: 'search' })
  @JoiSchema(joi.array().optional().label('search'))
  @Transform(({ value }) => QueryStringUtils.parseSearchCondition(value))
  readonly searchBy?: SearchCondition[];
}
