import { IQuery } from '@nestjs/cqrs';

class Props {
  readonly userId: string;
}

export class FindAccountOrganizersQuery extends Props implements IQuery {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
