import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TypeOrmOrganizerEntity } from './typeorm.organizer.entity';

@Entity({ name: 'event' })
export class TypeOrmEventEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'organizer_id' })
  readonly organizerId: string;

  // relations
  @ManyToOne(() => TypeOrmOrganizerEntity, (organizer) => organizer.events)
  @JoinColumn({ name: 'organizer_id' })
  readonly organizer: TypeOrmOrganizerEntity;
}
