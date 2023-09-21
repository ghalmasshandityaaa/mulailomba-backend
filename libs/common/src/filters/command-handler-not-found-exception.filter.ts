import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { CommandHandlerNotFoundException } from '@nestjs/cqrs';
import { Response } from 'express';
import { HttpErrorResponse } from '../interfaces';

@Catch(CommandHandlerNotFoundException)
export class CommandHandlerNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: CommandHandlerNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const res: HttpErrorResponse = {
      ok: false,
      error: {
        code: 'internal/command-handler-not-found',
        details: exception.message,
      },
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(res);
  }
}
