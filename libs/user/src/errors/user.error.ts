import { HttpErrorResponse } from '@aksesaja/common';
import { HttpException, HttpStatus } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UserError {
  export class NotFound extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'user/not-found',
          },
        } as HttpErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  export class AlreadyDeactivated extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'user/already-deactivated',
          },
        } as HttpErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  export class AlreadyExist extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'user/already-exist',
          },
        } as HttpErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
