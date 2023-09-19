import { HttpErrorResponse } from '@mulailomba/common';
import { HttpException, HttpStatus } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SlackError {
  export class ChannelNotFound extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'slack/channel-not-found',
          },
        } as HttpErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
