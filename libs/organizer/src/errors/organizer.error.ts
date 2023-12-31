import { HttpErrorResponse } from '@mulailomba/common';
import { HttpException, HttpStatus } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrganizerError {
  export class NotFound extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'organizer/not-found',
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
            code: 'organizer/already-deactivated',
          },
        } as HttpErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  export class EmailTaken extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'organizer/email-taken',
          },
        } as HttpErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  export class InvalidPassword extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'organizer/invalid-password',
          },
        } as HttpErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  export class SignedIn extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'organizer/signed-in',
            details: 'you are already logged in to an account',
          },
        } as HttpErrorResponse,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  export class AlreadyFavorited extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'organizer/already-favorited',
            message: 'Organizer is already favorited and cannot be favorited again.',
          },
        } as HttpErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  export class NotFavorited extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'organizer/not-favorited',
            message: 'Organizer is not favorited and cannot be unfavorited.',
          },
        } as HttpErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
