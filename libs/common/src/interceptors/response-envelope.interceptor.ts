import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HttpResponse } from '../interfaces';

@Injectable()
export class ResponseEnvelopeInterceptor<T> implements NestInterceptor<T, HttpResponse<T>> {
  intercept(_: ExecutionContext, next: CallHandler): Observable<HttpResponse<T>> {
    return next.handle().pipe(map((data) => ({ ok: true, ...data })));
  }
}
