import { CategoryModule } from '@mulailomba/category';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands';
import { EventController } from './controllers';
import { TypeOrmEventEntities } from './entities';
import { CREATE_EVENT_UNIT_OF_WORK_FACTORY, EVENT_READ_REPOSITORY } from './event.constants';
import { QueryHandlers } from './queries';
import { TypeOrmEventReadRepository } from './repositories';
import { CreateEventUnitOfWorkFactory } from './unit-of-work';

const Domains: Provider[] = [
  {
    provide: CREATE_EVENT_UNIT_OF_WORK_FACTORY,
    useClass: CreateEventUnitOfWorkFactory,
  },
];

const Repositories: Provider[] = [
  {
    provide: EVENT_READ_REPOSITORY,
    useClass: TypeOrmEventReadRepository,
  },
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature(TypeOrmEventEntities), CategoryModule],
  controllers: [EventController],
  providers: [...Domains, ...CommandHandlers, ...QueryHandlers, ...Repositories],
  exports: [],
})
export class EventModule {}
