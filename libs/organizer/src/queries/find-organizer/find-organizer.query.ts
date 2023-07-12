import { IQuery } from '@nestjs/cqrs';

class Props {
  readonly id: string;
}

export class FindOrganizerQuery extends Props implements IQuery {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
