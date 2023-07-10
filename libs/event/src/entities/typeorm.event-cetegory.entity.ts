import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { TypeOrmEventAdditionalInputEntity } from './typeorm.event-additional-input.entity';
import { TypeOrmEventTimelineEntity } from './typeorm.event-timeline.entity';
import { TypeOrmEventEntity } from './typeorm.event.entity';

@Entity({ name: 'event_category' })
export class TypeOrmEventCategoryEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'name' })
  readonly name: string;

  @Column({ name: 'price', default: 0 })
  readonly price: number;

  @Column({
    name: 'quota',
    default: NaN,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return Number(value);
      },
    },
  })
  readonly quota: number;

  @Column({ name: 'start_date' })
  readonly startDate: Date;

  @Column({ name: 'end_date' })
  readonly endDate: Date;

  @Column({ name: 'timeline_setting', default: false })
  readonly timelineSetting: boolean;

  @Column({ name: 'index' })
  readonly index: number;

  @Column({ name: 'created_at' })
  readonly createdAt: Date;

  @Column({ name: 'updated_at' })
  readonly updatedAt: Date;

  @Column({ name: 'event_id' })
  readonly eventId: string;

  // relations
  @ManyToOne(() => TypeOrmEventEntity, (event) => event.categories)
  @JoinColumn({ name: 'event_id' })
  readonly event: TypeOrmEventEntity;

  @OneToMany(() => TypeOrmEventTimelineEntity, (timeline) => timeline.categories)
  readonly timelines: TypeOrmEventTimelineEntity[];

  @OneToMany(() => TypeOrmEventAdditionalInputEntity, (input) => input.category)
  readonly additionalInputs: TypeOrmEventAdditionalInputEntity[];
}
