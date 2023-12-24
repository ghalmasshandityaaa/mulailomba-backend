import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioConfig } from './minio.interface';

@Injectable()
export class MinioConfigService implements MinioConfig {
  constructor(private config: ConfigService) {}
  get minioEndpoint(): string {
    return this.config.getOrThrow('MINIO_ENDPOINT');
  }

  get minioPort(): number {
    const port = this.config.getOrThrow('MINIO_PORT');
    return Number(port);
  }

  get minioSsl(): boolean {
    const ssl = this.config.getOrThrow('MINIO_SSL');
    return ssl === 'true';
  }

  get minioAccessKey(): string {
    return this.config.getOrThrow('MINIO_ACCESS_KEY');
  }

  get minioPrivateKey(): string {
    return this.config.getOrThrow('MINIO_PRIVATE_KEY');
  }
}
