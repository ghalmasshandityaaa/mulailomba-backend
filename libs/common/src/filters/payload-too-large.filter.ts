import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpErrorResponse } from '../interfaces';

@Catch(PayloadTooLargeException)
export class PayloadTooLargeExceptionErrorFilter implements ExceptionFilter {
  catch(_: PayloadTooLargeException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).send({
      ok: false,
      error: {
        code: 'request/payload-too-large',
      },
    } as HttpErrorResponse);
  }
}
