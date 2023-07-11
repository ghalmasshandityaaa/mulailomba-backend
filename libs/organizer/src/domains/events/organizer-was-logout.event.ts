import { DomainEvent } from '@mulailomba/common';

interface Props {
  organizerId: string;
}

export class OrganizerWasLogoutEvent extends DomainEvent<Props> {
  constructor(props: Props) {
    super(props);
  }
}
