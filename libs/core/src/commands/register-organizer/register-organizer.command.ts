import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly name: string;
  readonly emailAddress: string;
  readonly isLocked: boolean;
  readonly password: string;
  readonly userId: string;
}

export class RegisterOrganizerCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
