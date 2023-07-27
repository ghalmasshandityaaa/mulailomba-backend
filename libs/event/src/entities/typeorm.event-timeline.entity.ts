import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EVENT_TIMELINE_TYPE } from '../event.constants';
import { TypeOrmEventCategoryEntity } from './typeorm.event-cetegory.entity';
import { FileType } from './typeorm.event.entity';

@Entity({ name: 'event_timeline' })
export class TypeOrmEventTimelineEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'name', type: 'varchar', nullable: true })
  readonly name: string | null;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  readonly description: string | null;

  @Column({ name: 'start_date', type: 'timestamp with time zone', nullable: true })
  readonly startDate: Date | null;

  @Column({ name: 'end_date', type: 'timestamp with time zone', nullable: true })
  readonly endDate: Date | null;

  @Column({ name: 'type', type: 'enum', enum: EVENT_TIMELINE_TYPE })
  readonly type: EVENT_TIMELINE_TYPE;

  @Column({ name: 'input', type: 'varchar', nullable: true })
  readonly input: string | null;

  @Column({
    name: 'additional_file',
    type: 'text',
    transformer: {
      from(value) {
        return value ? JSON.parse(value) : null;
      },
      to(value) {
        return value ? JSON.stringify(value) : null;
      },
    },
  })
  readonly additionalFile: FileType | null;

  @Column({ name: 'created_at' })
  readonly createdAt: Date;

  @Column({ name: 'updated_at' })
  readonly updatedAt: Date;

  @Column({ name: 'event_category_id' })
  readonly eventCategoryId: string;

  // relations
  @ManyToOne(() => TypeOrmEventCategoryEntity, (eventCategory) => eventCategory.timelines)
  @JoinColumn({ name: 'event_category_id' })
  readonly category: TypeOrmEventCategoryEntity;
}
