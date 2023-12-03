import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly organizerId: string;
  readonly userId: string;
}

export class FavoriteCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
