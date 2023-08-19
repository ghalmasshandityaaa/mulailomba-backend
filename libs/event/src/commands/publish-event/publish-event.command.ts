import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly id: string;
  readonly organizerId: string;
}

export class PublishEventCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
