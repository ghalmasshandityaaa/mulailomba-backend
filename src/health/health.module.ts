import { CloudinaryModule } from '@mulailomba/cloudinary';
import { DynamicModule, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

export type HealthModuleOptions = {
  path?: string;
};

const defaultOptions: HealthModuleOptions = {
  path: 'health',
};

@Module({})
export class HealthModule {
  static forRoot(options?: HealthModuleOptions): DynamicModule {
    const opts: HealthModuleOptions = Object.assign({}, defaultOptions, options);

    const createRouter = () => {
      return RouterModule.register([
        {
          /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
          path: opts.path!,
          module: HealthModule,
        },
      ]);
    };

    const router = createRouter();
    return {
      module: HealthModule,
      imports: [TerminusModule, router, CloudinaryModule.forRoot()],
      controllers: [HealthController],
    };
  }
}
