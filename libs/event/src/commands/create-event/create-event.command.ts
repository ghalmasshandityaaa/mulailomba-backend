import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly userId: string;
}

export class CreateEventCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
