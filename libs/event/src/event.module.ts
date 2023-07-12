import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandHandlers } from './commands';
import { EventController } from './controllers';
import { TypeOrmEventEntities } from './entities';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature(TypeOrmEventEntities)],
  controllers: [EventController],
  providers: [...CommandHandlers],
  exports: [],
})
export class EventModule {}
