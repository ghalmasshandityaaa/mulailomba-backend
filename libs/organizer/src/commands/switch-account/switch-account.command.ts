import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly id: string;
  readonly organizerId: string;
  readonly password?: string;
}

export class SwitchAccountCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
