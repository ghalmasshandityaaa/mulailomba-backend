import {
  ApiVersionInterceptor,
  JoiSchemaErrorFilter,
  JoiSchemaValidationPipe,
  NotFoundErrorFilter,
  PayloadTooLargeExceptionErrorFilter,
} from '@mulailomba/common';
import { ServerConfigService } from '@mulailomba/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = app.get(ServerConfigService);
  app.useLogger(app.get(PinoLogger));
  app.use(json({ limit: '5mb' }));
  app.use(cookieParser());
  app
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
      new JoiSchemaValidationPipe(),
    )
    .useGlobalInterceptors(new ApiVersionInterceptor('1.0.0'))
    .useGlobalFilters(
      new JoiSchemaErrorFilter(),
      new NotFoundErrorFilter(),
      new PayloadTooLargeExceptionErrorFilter(),
    )
    .enableVersioning({
      type: VersioningType.URI,
    })
    .enableCors({
      origin: ['https://www.mulailomba.com', 'https://mulailomba.com', /\.mulailomba\.com$/],
      credentials: true,
      methods: ['GET', 'POST'],
    });

  await app.listen(config.port || 3000);
}
bootstrap();