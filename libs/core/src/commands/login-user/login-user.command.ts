import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly emailAddress: string;
  readonly password: string;
}

export class LoginUserCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
