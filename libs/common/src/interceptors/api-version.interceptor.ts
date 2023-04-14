import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ApiVersionInterceptor implements NestInterceptor {
  constructor(private version: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    response.header('x-api-version', this.version);
    return next.handle();
  }
}
