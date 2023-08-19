import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { TypeOrmEventBenefitEntity } from './typeorm.event-benefit.entity';
import { TypeOrmEventCategoryEntity } from './typeorm.event-cetegory.entity';
import { TypeOrmEventEligibilityEntity } from './typeorm.event-eligibility.entity';
import { TypeOrmOrganizerEntity } from './typeorm.organizer.entity';

export type FileType = {
  publicId: string;
  secureUrl: string;
};

@Entity({ name: 'event' })
export class TypeOrmEventEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'name' })
  readonly name: string;

  @Column({
    name: 'poster',
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
  readonly poster: FileType;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  readonly description: string | null;

  @Column({ name: 'is_multiple_category', default: false })
  readonly isMultipleCategory: boolean;

  @Column({
    name: 'benefits',
    type: 'text',
    transformer: {
      from(value) {
        return value ? JSON.parse(value) : [];
      },
      to(value) {
        return value ? JSON.stringify(value) : [];
      },
    },
  })
  readonly benefit: string[];

  @Column({
    name: 'eligibilities',
    type: 'text',
    transformer: {
      from(value) {
        return value ? JSON.parse(value) : [];
      },
      to(value) {
        return value ? JSON.stringify(value) : [];
      },
    },
  })
  readonly eligibility: string[];

  @Column({ name: 'created_at' })
  readonly createdAt: Date;

  @Column({ name: 'updated_at' })
  readonly updatedAt: Date;

  @Column({ name: 'category_id' })
  readonly categoryId: string;

  @Column({ name: 'organizer_id' })
  readonly organizerId: string;

  // relations
  @ManyToMany(() => TypeOrmEventBenefitEntity)
  @JoinTable()
  readonly benefits: TypeOrmEventBenefitEntity[];

  @ManyToMany(() => TypeOrmEventEligibilityEntity)
  @JoinTable()
  readonly eligibilities: TypeOrmEventEligibilityEntity[];

  @OneToMany(() => TypeOrmEventCategoryEntity, (eventCategory) => eventCategory.event)
  readonly categories: TypeOrmEventCategoryEntity[];

  @ManyToOne(() => TypeOrmOrganizerEntity, (organizer) => organizer.events)
  @JoinColumn({ name: 'organizer_id' })
  readonly organizer: TypeOrmOrganizerEntity;
}
