import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TypeOrmEventEntity } from './typeorm.event.entity';

@Entity({ name: 'organizer' })
export class TypeOrmOrganizerEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'name' })
  readonly name: string;

  @OneToMany(() => TypeOrmEventEntity, (event) => event.organizer)
  readonly events: TypeOrmEventEntity[];
}
