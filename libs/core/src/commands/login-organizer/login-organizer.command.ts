import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly id: string;
  readonly userId: string;
  readonly password?: string;
}

export class LoginOrganizerCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
