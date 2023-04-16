import { DynamicModule, Module, Provider } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { alphanumeric } from 'nanoid-dictionary';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import pino, { LoggerOptions } from 'pino';
import { Options } from 'pino-http';
import { LoggerModuleAsyncOptions, LoggerModuleOptions } from './interfaces';
import { OPTIONS_PROVIDER, TYPEORM_PINO_LOGGER } from './logger.constants';
import { createAsyncOptionsProvider } from './logger.providers';
import { TypeOrmPinoLoggerProvider } from './providers/typeorm.pino-logger.provider';

@Module({})
export class LoggerModule {
  /**
   *
   * @param options
   * @returns
   */
  static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    const providers: Provider<any>[] = [
      createAsyncOptionsProvider(options),
      { provide: TYPEORM_PINO_LOGGER, useClass: TypeOrmPinoLoggerProvider },
    ];

    return {
      global: true,
      module: LoggerModule,
      imports: [
        ...(options.imports || []),
        PinoLoggerModule.forRootAsync({
          useFactory: (options: LoggerModuleOptions) => ({
            exclude: options.excludePath,
            pinoHttp: this.getPinoHttpConfig(options),
          }),
          inject: [OPTIONS_PROVIDER],
        }),
      ],
      providers,
      exports: providers,
    };
  }

  /**
   *
   * @param options
   * @returns
   */
  private static getPinoHttpConfig(options: LoggerModuleOptions): Options {
    const pinoOptions: LoggerOptions = {
      level: options.level,
      formatters: {
        // removes pid + hostname
        bindings: () => ({}),
      },
    };

    return {
      logger: pino(pinoOptions),
      genReqId: (): string => {
        const nanoid = customAlphabet(alphanumeric, 30);
        const id = nanoid();
        return id;
      },
      quietReqLogger: true,
    };
  }
}
