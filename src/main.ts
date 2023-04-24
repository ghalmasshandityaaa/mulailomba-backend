import {
  ApiVersionInterceptor,
  JoiSchemaErrorFilter,
  JoiSchemaValidationPipe,
  NotFoundErrorFilter,
} from '@aksesaja/common';
import { ServerConfigService } from '@aksesaja/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';

declare const module: any;
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
    .useGlobalInterceptors(new ApiVersionInterceptor('2.0.0'))
    .useGlobalFilters(new JoiSchemaErrorFilter(), new NotFoundErrorFilter())
    .enableVersioning({
      type: VersioningType.URI,
    })
    .enableCors({
      origin: config.cors.origin,
      methods: ['GET', 'POST'],
    });

  await app.listen(config.port, '0.0.0.0');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
