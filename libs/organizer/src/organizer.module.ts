import { TokenModule } from '@mulailomba/token';
import { UserModule } from '@mulailomba/user';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands';
import {
  ORGANIZER_READ_REPOSITORY,
  ORGANIZER_SERVICE,
  ORGANIZER_WRITE_REPOSITORY,
} from './constants';
import { OrganizerController } from './controllers';
import { TypeOrmOrganizerEntities } from './entities';
import { Listeners } from './listeners';
import { QueryHandlers } from './queries';
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
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature(TypeOrmOrganizerEntities),
    TokenModule,
    UserModule,
  ],
  controllers: [OrganizerController],
  providers: [...Services, ...Repositories, ...CommandHandlers, ...QueryHandlers, ...Listeners],
  exports: [...Services],
})
export class OrganizerModule {}
