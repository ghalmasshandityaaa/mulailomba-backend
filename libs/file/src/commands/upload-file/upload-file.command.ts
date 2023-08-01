import { UploadedFileType } from '@mulailomba/common';
import { FILE_TOPIC_TYPE } from '@mulailomba/file/file.constants';
import { ICommand } from '@nestjs/cqrs';

class Props {
  readonly identityId: string;
  readonly file: UploadedFileType;
  readonly topic: FILE_TOPIC_TYPE;
}

export class UploadFileCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
