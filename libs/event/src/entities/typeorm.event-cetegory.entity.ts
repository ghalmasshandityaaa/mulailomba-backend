import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { TypeOrmEventPrerequisiteEntity } from './typeorm.event-prerequisite.entity';
import { TypeOrmEventTimelineEntity } from './typeorm.event-timeline.entity';
import { TypeOrmEventEntity } from './typeorm.event.entity';

@Entity({ name: 'event_category' })
export class TypeOrmEventCategoryEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'name', type: 'varchar', nullable: true })
  readonly name: string | null;

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

  @Column({ name: 'registration_start' })
  readonly registrationStart: Date;

  @Column({ name: 'registration_end' })
  readonly registrationEnd: Date;

  @Column({ name: 'start_date' })
  readonly startDate: Date;

  @Column({ name: 'end_date' })
  readonly endDate: Date;

  @Column({ name: 'timeline_setting', default: false })
  readonly timelineSetting: boolean;

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

  @OneToMany(() => TypeOrmEventTimelineEntity, (timeline) => timeline.category)
  readonly timelines: TypeOrmEventTimelineEntity[];

  @OneToMany(() => TypeOrmEventPrerequisiteEntity, (input) => input.category)
  readonly prerequisites: TypeOrmEventPrerequisiteEntity[];
}
