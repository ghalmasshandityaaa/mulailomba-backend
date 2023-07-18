import { TypeOrmUnitOfWork } from '@mulailomba/common/unit-of-works';
import { DataSource, Repository } from 'typeorm';
import {
  EventAdditionalInputEntity,
  EventCategoryEntity,
  EventEntity,
  EventTimelineEntity,
} from '../domains';
import { TypeOrmEventAdditionalInputEntity } from '../entities/typeorm.event-additional-input.entity';
import { TypeOrmEventCategoryEntity } from '../entities/typeorm.event-cetegory.entity';
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
  get eventAdditionalInputRepository(): Repository<TypeOrmEventAdditionalInputEntity> {
    return this.getRepository(TypeOrmEventAdditionalInputEntity);
  }

  // #end_region

  constructor(private dataSource: DataSource) {
    super(dataSource);
  }

  async saveEvent(event: EventEntity[]): Promise<void> {
    await this.eventRepository.insert(event.map((e) => ({ id: e.id, ...e.props })));
  }

  async saveEventCategory(eventCategory: EventCategoryEntity[]): Promise<void> {
    await this.eventCategoryRepository.insert(eventCategory.map((e) => ({ id: e.id, ...e.props })));
  }

  async saveEventTimeline(eventTimeline: EventTimelineEntity[]): Promise<void> {
    await this.eventTimelineRepository.insert(eventTimeline.map((e) => ({ id: e.id, ...e.props })));
  }

  async saveEventAdditionalInput(
    eventAdditionalInput: EventAdditionalInputEntity[],
  ): Promise<void> {
    await this.eventAdditionalInputRepository.insert(
      eventAdditionalInput.map((e) => ({ id: e.id, ...e.props })),
    );
  }
}
