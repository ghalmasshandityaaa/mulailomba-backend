import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly emailAddress: string;
}

export class CheckAvailabilityEmailCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
