import { HttpErrorResponse } from '@mulailomba/common';
import { HttpException, HttpStatus } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CategoryError {
  export class NotFound extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'category/not-found',
          },
        } as HttpErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
