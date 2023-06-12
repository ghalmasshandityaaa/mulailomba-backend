import { HttpErrorResponse } from '@mulailomba/common';
import { HttpException, HttpStatus } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ServerError {
  export class Internal extends HttpException {
    constructor(customMessage?: string) {
      super(
        {
          ok: false,
          error: {
            code: 'internal/server-error',
            details: customMessage,
          },
        } as HttpErrorResponse,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
