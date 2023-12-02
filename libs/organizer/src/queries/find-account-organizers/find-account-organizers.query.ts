import { ISearchableQuery, SearchCondition } from '@mulailomba/common';
import { IQuery } from '@nestjs/cqrs';

class Props implements ISearchableQuery {
  readonly userId: string;
  readonly searchBy?: SearchCondition[];
}

export class FindAccountOrganizersQuery extends Props implements IQuery {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
