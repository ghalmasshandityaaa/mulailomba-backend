import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly fullName: string;
  readonly phone: string;
  readonly password: string;
  readonly emailAddress: string;
}

export class RegisterUserCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
