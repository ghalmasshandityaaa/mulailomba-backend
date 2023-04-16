import { Provider } from '@nestjs/common';
import { LoggerModuleAsyncOptions, LoggerModuleOptions } from './interfaces';
import { OPTIONS_PROVIDER } from './logger.constants';

/**
 *
 * @param options
 * @returns
 */
export const createAsyncOptionsProvider = (
  options: LoggerModuleAsyncOptions,
): Provider<Promise<LoggerModuleOptions> | LoggerModuleOptions> => {
  return {
    provide: OPTIONS_PROVIDER,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useFactory: options.useFactory!,
    inject: options.inject || [],
  };
};
