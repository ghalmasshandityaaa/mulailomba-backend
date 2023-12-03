import { UploadedFileType } from '@mulailomba/common';
import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly name: string;
  readonly emailAddress: string;
  readonly isLocked: boolean;
  readonly password: string;
  readonly userId: string;
  readonly profile?: UploadedFileType;
  readonly background?: UploadedFileType;
}

export class RegisterOrganizerCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
