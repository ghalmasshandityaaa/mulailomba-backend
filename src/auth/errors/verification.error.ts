import { HttpErrorResponse } from '@mulailomba/common';
import { HttpException, HttpStatus } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace VerificationError {
  export class InvalidCode extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'verification/invalid-code',
          },
        } as HttpErrorResponse,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
