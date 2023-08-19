import { CategoryModule } from '@mulailomba/category';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands';
import { EventController } from './controllers';
import { TypeOrmEventEntities } from './entities';
import {
  CREATE_EVENT_UNIT_OF_WORK_FACTORY,
  EVENT_CATEGORY_WRITE_REPOSITORY,
  EVENT_READ_REPOSITORY,
  EVENT_WRITE_REPOSITORY,
} from './event.constants';
import { Listeners } from './listeners';
import { QueryHandlers } from './queries';
import { TypeOrmEventReadRepository, TypeOrmEventWriteRepository } from './repositories';
import { TypeOrmEventCategoryWriteRepository } from './repositories/typeorm/typeorm.event-category.write-repository';
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
  {
    provide: EVENT_WRITE_REPOSITORY,
    useClass: TypeOrmEventWriteRepository,
  },
  {
    provide: EVENT_CATEGORY_WRITE_REPOSITORY,
    useClass: TypeOrmEventCategoryWriteRepository,
  },
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature(TypeOrmEventEntities), CategoryModule],
  controllers: [EventController],
  providers: [...Domains, ...CommandHandlers, ...QueryHandlers, ...Repositories, ...Listeners],
  exports: [],
})
export class EventModule {}
