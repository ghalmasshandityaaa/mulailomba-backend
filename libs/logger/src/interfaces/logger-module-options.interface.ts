import { ModuleMetadata } from '@nestjs/common';
import { Level } from 'pino';

export interface LoggerModuleOptions {
  level?: Level;
  excludePath?: string[];
}

export interface LoggerModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
  inject?: any[];
}
