import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { QueryHandlerNotFoundException } from '@nestjs/cqrs';
import { Response } from 'express';
import { HttpErrorResponse } from '../interfaces';

@Catch(QueryHandlerNotFoundException)
export class QueryHandlerNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: QueryHandlerNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const res: HttpErrorResponse = {
      ok: false,
      error: {
        code: 'internal/query-handler-not-found',
        details: exception.message,
      },
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(res);
  }
}
