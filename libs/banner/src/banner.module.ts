import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BANNER_READ_REPOSITORY } from './banner.constants';
import { BannerController } from './controllers';
import { TypeOrmBannerEntities } from './entities/typeorm';
import { QueryHandlers } from './queries';
import { TypeOrmBannerReadRepository } from './repositories/typeorm';

const Providers: Provider<any>[] = [];
const Repositories: Provider<any>[] = [
  {
    provide: BANNER_READ_REPOSITORY,
    useClass: TypeOrmBannerReadRepository,
  },
];

@Module({
  controllers: [BannerController],
  imports: [CqrsModule, TypeOrmModule.forFeature(TypeOrmBannerEntities)],
  providers: [...QueryHandlers, ...Repositories, ...Providers],
  exports: [],
})
export class BannerModule {}
