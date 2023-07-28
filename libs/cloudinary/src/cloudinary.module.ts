import { DynamicModule, Module, Provider } from '@nestjs/common';
import { CloudinaryOptions, CLOUDINARY_OPTIONS } from './cloudinary.interface';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryConfigModule, CloudinaryConfigService } from './config';

@Module({})
export class CloudinaryModule {
  static forRoot(options?: CloudinaryOptions): DynamicModule {
    const optionsProvider: Provider<CloudinaryOptions> = {
      provide: CLOUDINARY_OPTIONS,
      useFactory: (config: CloudinaryConfigService) => {
        if (typeof config.dryRun === 'undefined') {
          return {
            dryRun: options?.dryRun || false,
            cloudName: options?.cloudName || '',
            apiKey: options?.apiKey || '',
            apiSecret: options?.apiSecret || '',
          };
        }

        return {
          dryRun: options && options.dryRun ? options.dryRun : config.dryRun,
          cloudName: options && options.cloudName ? options.cloudName : config.cloudName,
          apiKey: options && options.apiKey ? options.apiKey : config.apiKey,
          apiSecret: options && options.apiSecret ? options.apiSecret : config.apiSecret,
        };
      },
      inject: [CloudinaryConfigService],
    };

    return {
      imports: [CloudinaryConfigModule],
      module: CloudinaryModule,
      providers: [optionsProvider, CloudinaryService],
      exports: [CloudinaryService, optionsProvider],
    };
  }
}
