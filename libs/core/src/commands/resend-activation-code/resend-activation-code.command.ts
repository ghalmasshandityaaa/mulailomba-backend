import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly email: string;
}

export class ResendActivationCodeCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
