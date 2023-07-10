import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EVENT_TIMELINE_TYPE } from '../event.constants';
import { TypeOrmEventCategoryEntity } from './typeorm.event-cetegory.entity';

@Entity({ name: 'event_timeline' })
export class TypeOrmEventTimelineEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'name' })
  readonly name: string;

  @Column({ name: 'description' })
  readonly description: string;

  @Column({ name: 'start_date' })
  readonly startDate: Date;

  @Column({ name: 'end_date' })
  readonly endDate: Date;

  @Column({ name: 'type', type: 'enum', enum: EVENT_TIMELINE_TYPE })
  readonly type: EVENT_TIMELINE_TYPE;

  @Column({ name: 'link' })
  readonly link: string;

  @Column({ name: 'index' })
  readonly index: number;

  @Column({ name: 'created_at' })
  readonly createdAt: Date;

  @Column({ name: 'updated_at' })
  readonly updatedAt: Date;

  @Column({ name: 'event_category_id' })
  readonly eventCategoryId: string;

  // relations
  @ManyToOne(() => TypeOrmEventCategoryEntity, (eventCategory) => eventCategory.timelines)
  @JoinColumn({ name: 'event_category_id' })
  readonly categories: TypeOrmEventCategoryEntity;
}
