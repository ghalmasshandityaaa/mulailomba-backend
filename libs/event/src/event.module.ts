import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands';
import { EventController } from './controllers';
import { TypeOrmEventEntities } from './entities';
import { CREATE_EVENT_UNIT_OF_WORK_FACTORY } from './event.constants';
import { CreateEventUnitOfWorkFactory } from './unit-of-work';

const Domains: Provider[] = [
  {
    provide: CREATE_EVENT_UNIT_OF_WORK_FACTORY,
    useClass: CreateEventUnitOfWorkFactory,
  },
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature(TypeOrmEventEntities)],
  controllers: [EventController],
  providers: [...Domains, ...CommandHandlers],
  exports: [],
})
export class EventModule {}
