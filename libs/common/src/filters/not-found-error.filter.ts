import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpErrorResponse } from '../interfaces';

@Catch(NotFoundException)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(_: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).send({
      ok: false,
      error: {
        code: 'request/not-found',
      },
    } as HttpErrorResponse);
  }
}
