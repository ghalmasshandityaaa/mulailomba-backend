import { DomainEvent } from '@mulailomba/common';

interface Props {
  id: string;
}

export class EventPublishEvent extends DomainEvent<Props> {
  constructor(props: Props) {
    super(props);
  }
}
