import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ORGANIZER_READ_REPOSITORY,
  ORGANIZER_SERVICE,
  ORGANIZER_WRITE_REPOSITORY,
} from './constants';
import { TypeOrmOrganizerEntities } from './entities';
import { TypeOrmOrganizerReadRepository, TypeOrmOrganizerWriteRepository } from './repositories';
import { OrganizerService } from './services';

const Services: Provider<any>[] = [
  {
    provide: ORGANIZER_SERVICE,
    useClass: OrganizerService,
  },
];

const Repositories = [
  {
    provide: ORGANIZER_READ_REPOSITORY,
    useClass: TypeOrmOrganizerReadRepository,
  },
  {
    provide: ORGANIZER_WRITE_REPOSITORY,
    useClass: TypeOrmOrganizerWriteRepository,
  },
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature(TypeOrmOrganizerEntities)],
  providers: [...Services, ...Repositories],
  exports: [...Services],
})
export class OrganizerModule {}
