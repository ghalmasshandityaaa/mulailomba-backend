import {
  ApiVersionInterceptor,
  CommandHandlerNotFoundExceptionFilter,
  JoiSchemaExceptionFilter,
  JoiSchemaValidationPipe,
  NotFoundExceptionFilter,
  PayloadTooLargeExceptionFilter,
  QueryHandlerNotFoundExceptionFilter,
  UnhandledExceptionFilter,
} from '@mulailomba/common';
import { ServerConfigService } from '@mulailomba/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = app.get(ServerConfigService);
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.use(json({ limit: '5mb' }));
  app.use(cookieParser());

  app.use(
    helmet({
      contentSecurityPolicy: true,
      hidePoweredBy: true,
    }),
  );
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
      new JoiSchemaExceptionFilter(),
      new UnhandledExceptionFilter(),
      new NotFoundExceptionFilter(),
      new PayloadTooLargeExceptionFilter(),
      new QueryHandlerNotFoundExceptionFilter(),
      new CommandHandlerNotFoundExceptionFilter(),
    )
    .enableVersioning({
      type: VersioningType.URI,
    })
    .enableCors({
      origin: ['https://www.mulailomba.com', 'https://mulailomba.com', /\.mulailomba\.com$/],
      credentials: true,
      methods: ['GET', 'POST'],
    });

  console.log(123, config.port);
  await app.listen(config.port || 3000, () => {
    logger.log(`API service running on port ${config.port}...`);
  });
}
bootstrap();
