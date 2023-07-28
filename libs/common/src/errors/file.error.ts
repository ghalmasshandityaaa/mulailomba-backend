import { HttpErrorResponse } from '@mulailomba/common';
import { HttpException, HttpStatus } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FileError {
  export class UnsupportedFormat extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'file/unsupported-format',
          },
        } as HttpErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
