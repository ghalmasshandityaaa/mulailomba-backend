import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MinioConfigModule, MinioConfigService } from './config';
import { MINIO_OPTIONS, MinioOptions } from './minio.interface';
import { MinioService } from './minio.service';

@Module({})
export class MinioModule {
  static forRoot(): DynamicModule {
    const optionsProvider: Provider<MinioOptions> = {
      provide: MINIO_OPTIONS,
      useFactory: (config: MinioConfigService) => {
        return {
          minioEndpoint: config.minioEndpoint,
          minioPort: config.minioPort,
          minioSsl: config.minioSsl,
          minioAccessKey: config.minioAccessKey,
          minioPrivateKey: config.minioPrivateKey,
        };
      },
      inject: [MinioConfigService],
    };

    return {
      imports: [MinioConfigModule],
      module: MinioModule,
      providers: [optionsProvider, MinioService],
      exports: [MinioService, optionsProvider],
    };
  }
}
