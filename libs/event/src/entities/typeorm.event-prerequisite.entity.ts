import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EVENT_PREREQUISITE_TYPE_ENUM } from '../event.constants';
import { TypeOrmEventCategoryEntity } from './typeorm.event-cetegory.entity';

@Entity({ name: 'event_prerequisite' })
export class TypeOrmEventPrerequisiteEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'name' })
  readonly name: string;

  @Column({ name: 'description' })
  readonly description: string;

  @Column({ name: 'type', type: 'enum', enum: EVENT_PREREQUISITE_TYPE_ENUM })
  readonly type: EVENT_PREREQUISITE_TYPE_ENUM;

  @Column({
    name: 'answer',
    type: 'text',
    nullable: true,
    transformer: {
      from(value) {
        return value ? value.slice(1, -1).split(',') : [];
      },
      to(value) {
        return value ? JSON.stringify(value) : [];
      },
    },
  })
  readonly answer: string[] | null;

  @Column({ name: 'is_required' })
  readonly isRequired: boolean;

  @Column({ name: 'index' })
  readonly index: number;

  @Column({ name: 'created_at' })
  readonly createdAt: Date;

  @Column({ name: 'updated_at' })
  readonly updatedAt: Date;

  @Column({ name: 'event_category_id' })
  readonly eventCategoryId: string;

  // relations
  @ManyToOne(() => TypeOrmEventCategoryEntity, (eventCategory) => eventCategory.prerequisites)
  @JoinColumn({ name: 'event_category_id' })
  readonly category: TypeOrmEventCategoryEntity;
}
