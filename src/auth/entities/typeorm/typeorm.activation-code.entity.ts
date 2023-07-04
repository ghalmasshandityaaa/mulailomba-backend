import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'activation_code' })
export class TypeOrmActivationCodeEntity {
  @PrimaryColumn({ name: 'email_address' })
  readonly emailAddress: string;

  @Column({ name: 'activation_code' })
  readonly activationCode: string;

  @Column({ name: 'created_at' })
  readonly createdAt: Date;
}
