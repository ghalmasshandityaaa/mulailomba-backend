import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './controllers';
import { TypeOrmEventEntities } from './entities';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature(TypeOrmEventEntities)],
  controllers: [EventController],
  providers: [],
  exports: [],
})
export class EventModule {}
