import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class Base64FileInterceptor implements NestInterceptor {
  constructor(@InjectPinoLogger(Base64FileInterceptor.name) private readonly logger: PinoLogger) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const file: any = request.file;

    if (file) {
      try {
        file.filename = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
        file.base64 = file.buffer.toString('base64');
      } catch (err) {
        this.logger.error('Error while converting to base64. cause: ', err.message);
      }
    }

    return next.handle().pipe(map((data) => data));
  }
}
