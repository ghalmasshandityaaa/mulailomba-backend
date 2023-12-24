import { DomainEvent } from '@mulailomba/common';

interface Props {
  userId: string;
}

export class UserWasCreatedEvent extends DomainEvent<Props> {
  constructor(props: Props) {
    super(props);
  }
}
