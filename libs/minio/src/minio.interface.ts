import { ModuleMetadata, Type } from '@nestjs/common';

export const MINIO_OPTIONS = 'minio-options';
export interface MinioOptions {
  minioEndpoint: string;
  minioPort: number;
  minioSsl: boolean;
  minioAccessKey: string;
  minioPrivateKey: string;
}

export interface MinioOptionsFactory {
  create(): Promise<MinioOptions> | MinioOptions;
}

export interface MinioAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useClass?: Type<MinioOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<MinioOptions> | MinioOptions;
  inject?: any[];
}
