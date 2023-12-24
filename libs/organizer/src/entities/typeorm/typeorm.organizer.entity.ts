import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TypeOrmEventEntity } from './typeorm.event.entity';

@Entity({ name: 'organizer' })
export class TypeOrmOrganizerEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'name' })
  readonly name: string;

  @Column({ name: 'username' })
  readonly username: string;

  @Column({
    name: 'profile',
    type: 'varchar',
    nullable: true,
  })
  readonly profile: string | null;

  @Column({
    name: 'background',
    type: 'varchar',
    nullable: true,
  })
  readonly background: string | null;

  @Column({ name: 'email_address' })
  readonly emailAddress: string;

  @Column({ name: 'password' })
  readonly password: string;

  @Column({ name: 'is_locked' })
  readonly isLocked: boolean;

  @Column({ name: 'is_active' })
  readonly isActive: boolean;

  @Column({ name: 'is_favorite' })
  readonly isFavorite: boolean;

  @Column({ name: 'created_at' })
  readonly createdAt: Date;

  @Column({ name: 'updated_at' })
  readonly updatedAt: Date;

  @Column({ name: 'logout_at' })
  readonly logoutAt: Date;

  @Column({ name: 'user_id' })
  readonly userId: string;

  // relations
  @OneToMany(() => TypeOrmEventEntity, (event) => event.organizer)
  readonly events: TypeOrmEventEntity[];
}
