import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { TypeOrmEventBenefitEntity } from './typeorm.event-benefit.entity';
import { TypeOrmEventCategoryEntity } from './typeorm.event-cetegory.entity';
import { TypeOrmEventEligibilityEntity } from './typeorm.event-eligibility.entity';

@Entity({ name: 'event' })
export class TypeOrmEventEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'name' })
  readonly name: string;

  @Column({ name: 'description' })
  readonly description: string;

  @Column({ name: 'is_multiple_category', default: false })
  readonly isMultipleCategory: boolean;

  @Column({ name: 'benefits' })
  readonly benefit: string;

  @Column({ name: 'eligibilities' })
  readonly eligibility: string;

  @Column({ name: 'steps' })
  readonly steps: string;

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
}
