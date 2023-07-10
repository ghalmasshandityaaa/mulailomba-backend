import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EVENT_ADDITIONAL_INPUT_TYPE } from '../event.constants';
import { TypeOrmEventCategoryEntity } from './typeorm.event-cetegory.entity';

@Entity({ name: 'event_additional_input' })
export class TypeOrmEventAdditionalInputEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'name' })
  readonly name: string;

  @Column({ name: 'description' })
  readonly description: string;

  @Column({ name: 'type', type: 'enum', enum: EVENT_ADDITIONAL_INPUT_TYPE })
  readonly type: EVENT_ADDITIONAL_INPUT_TYPE;

  @Column({
    name: 'answer',
    nullable: true,
  })
  readonly answer: string;

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
  @ManyToOne(() => TypeOrmEventCategoryEntity, (eventCategory) => eventCategory.additionalInputs)
  @JoinColumn({ name: 'event_category_id' })
  readonly category: TypeOrmEventCategoryEntity;
}
