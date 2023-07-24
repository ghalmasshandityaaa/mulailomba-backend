import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly id: string;
}

export class VerifyUserCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
