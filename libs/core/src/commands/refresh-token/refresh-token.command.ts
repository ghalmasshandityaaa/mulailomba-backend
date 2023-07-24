import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly token: string;
}

export class RefreshTokenCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
