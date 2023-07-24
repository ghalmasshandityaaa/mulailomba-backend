import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly id: string;
}

export class OrganizerLogoutCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
