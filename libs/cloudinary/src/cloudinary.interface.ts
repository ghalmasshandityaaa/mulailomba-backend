import { ModuleMetadata, Type } from '@nestjs/common';

export const CLOUDINARY_OPTIONS = 'cloudinary-options';
export interface CloudinaryOptions {
  dryRun: boolean;
  cloudName: string | undefined;
  apiKey: string | undefined;
  apiSecret: string | undefined;
}

export interface CloudinaryOptionsFactory {
  create(): Promise<CloudinaryOptions> | CloudinaryOptions;
}

export interface CloudinaryAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useClass?: Type<CloudinaryOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<CloudinaryOptions> | CloudinaryOptions;
  inject?: any[];
}
