import { TypeOrmUnitOfWork } from '@mulailomba/common/unit-of-works';
import { DataSource, Repository } from 'typeorm';
import {
  EventAggregate,
  EventCategoryEntity,
  EventPrerequisiteEntity,
  EventTimelineEntity,
} from '../domains';
import { TypeOrmEventCategoryEntity } from '../entities/typeorm.event-cetegory.entity';
import { TypeOrmEventPrerequisiteEntity } from '../entities/typeorm.event-prerequisite.entity';
import { TypeOrmEventTimelineEntity } from '../entities/typeorm.event-timeline.entity';
import { TypeOrmEventEntity } from '../entities/typeorm.event.entity';
import { ICreateEventUnitOfWork } from '../interfaces/unit-of-work';

export class CreateEventUnitOfWork extends TypeOrmUnitOfWork implements ICreateEventUnitOfWork {
  // #region_getters

  get eventRepository(): Repository<TypeOrmEventEntity> {
    return this.getRepository(TypeOrmEventEntity);
  }
  get eventCategoryRepository(): Repository<TypeOrmEventCategoryEntity> {
    return this.getRepository(TypeOrmEventCategoryEntity);
  }
  get eventTimelineRepository(): Repository<TypeOrmEventTimelineEntity> {
    return this.getRepository(TypeOrmEventTimelineEntity);
  }
  get eventPrerequisiteRepository(): Repository<TypeOrmEventPrerequisiteEntity> {
    return this.getRepository(TypeOrmEventPrerequisiteEntity);
  }

  // #end_region

  constructor(private dataSource: DataSource) {
    super(dataSource);
  }

  async saveEvent(event: EventAggregate[]): Promise<void> {
    await this.eventRepository.insert(event.map((e) => ({ id: e.id, ...e.props })));
  }

  async saveEventCategory(eventCategory: EventCategoryEntity[]): Promise<void> {
    await this.eventCategoryRepository.insert(eventCategory.map((e) => ({ id: e.id, ...e.props })));
  }

  async saveEventTimeline(eventTimeline: EventTimelineEntity[]): Promise<void> {
    await this.eventTimelineRepository.insert(eventTimeline.map((e) => ({ id: e.id, ...e.props })));
  }

  async saveEventPrerequisite(prerequisite: EventPrerequisiteEntity[]): Promise<void> {
    await this.eventPrerequisiteRepository.insert(
      prerequisite.map((e) => ({ id: e.id, ...e.props })),
    );
  }
}
