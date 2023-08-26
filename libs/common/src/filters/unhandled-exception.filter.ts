import { Response } from 'express';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

import { HttpErrorResponse } from '../interfaces';

@Catch(InternalServerErrorException)
export class UnhandledExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const res: HttpErrorResponse = {
      ok: false,
      error: {
        code: 'internal/server-error',
        details: undefined,
      },
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(res);
  }
}
