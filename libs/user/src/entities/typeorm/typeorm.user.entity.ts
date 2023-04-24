import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class TypeOrmUserEntity {
  @PrimaryColumn({ type: 'uuid' })
  readonly id: string;

  @Column({ name: 'full_name' })
  readonly fullName: string;

  @Column({ name: 'phone' })
  readonly phone: string;

  @Column({ name: 'email_address' })
  readonly emailAddress: string;

  @Column({ name: 'password' })
  readonly password: string;

  @Column({ name: 'is_active' })
  readonly isActive: boolean;

  @Column({ name: 'created_at' })
  readonly createdAt: Date;

  @Column({ name: 'updated_at' })
  readonly updatedAt: Date;
}
