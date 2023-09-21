import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { JoiValidationError } from '../pipes';

@Catch(JoiValidationError)
export class JoiSchemaExceptionFilter implements ExceptionFilter {
  catch(exception: JoiValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(exception.getStatus()).send(exception.getResponse());
  }
}
