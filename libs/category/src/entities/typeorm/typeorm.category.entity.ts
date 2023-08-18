import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'category' })
export class TypeOrmCategoryEntity {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  readonly id: string;

  @Column({ name: 'name' })
  readonly name: string;

  @Column({ name: 'description' })
  readonly description: string;

  @Column({ name: 'created_at' })
  readonly createdAt: Date;

  @Column({ name: 'created_by', type: 'uuid' })
  readonly createdBy: string;

  @Column({ name: 'updated_at' })
  readonly updatedAt: Date;

  @Column({ name: 'updated_by', type: 'uuid' })
  readonly updatedBy: string;
}
