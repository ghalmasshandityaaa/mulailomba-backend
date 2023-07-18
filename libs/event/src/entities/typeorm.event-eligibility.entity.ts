import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { TypeOrmEventEntity } from './typeorm.event.entity';

@Entity({ name: 'event_eligibility' })
export class TypeOrmEventEligibilityEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'label' })
  readonly label: string;

  @Column({ name: 'created_at' })
  readonly createdAt: Date;

  @Column({ name: 'updated_at' })
  readonly updatedAt: Date;

  @Column({ name: 'created_by', type: 'uuid' })
  readonly createdBy: string;

  @Column({ name: 'updated_by', type: 'uuid' })
  readonly updatedBy: string;

  // relations
  @ManyToMany(() => TypeOrmEventEntity)
  @JoinTable()
  events: TypeOrmEventEntity[];
}
