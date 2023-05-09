import { HttpErrorResponse } from '@aksesaja/common';
import { HttpException, HttpStatus } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AuthError {
  export class ExpiredToken extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'auth/expired-token',
          },
        } as HttpErrorResponse,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  export class InvalidCredentials extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'auth/invalid-credentials',
          },
        } as HttpErrorResponse,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  export class ForbiddenAccess extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'auth/forbidden-access',
          },
        } as HttpErrorResponse,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  export class AlreadyDeactivated extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'account/already-deactivated',
          },
        } as HttpErrorResponse,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  export class EmailNotRegistered extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'auth/email-not-registered',
          },
        } as HttpErrorResponse,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  export class SignedIn extends HttpException {
    constructor() {
      super(
        {
          ok: false,
          error: {
            code: 'auth/signed-in',
            details: 'you are already logged in to an account',
          },
        } as HttpErrorResponse,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
