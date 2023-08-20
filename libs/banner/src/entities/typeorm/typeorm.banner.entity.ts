import { FileType } from '@mulailomba/common';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum BannerPosition {
  HOMEPAGE = 'HOMEPAGE',
  EVENT = 'EVENT',
}

export enum BannerStatus {
  SOON = 'SOON',
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
}

@Entity({ name: 'banner' })
export class TypeOrmBannerEntity {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  readonly id: string;

  @Column({ name: 'name' })
  readonly name: string;

  @Column({ name: 'description' })
  readonly description: string;

  @Column({ name: 'position', type: 'enum', enum: BannerPosition })
  readonly position: BannerPosition;

  @Column({
    name: 'file',
    type: 'text',
    transformer: {
      from(value) {
        return JSON.parse(value);
      },
      to(value) {
        return JSON.stringify(value);
      },
    },
  })
  readonly file: FileType;

  @Column({ name: 'start_date' })
  readonly startDate: Date;

  @Column({ name: 'start_date' })
  readonly endDate: Date;

  @Column({ name: 'status', type: 'enum', enum: BannerStatus })
  readonly status: BannerStatus;

  @Column({ name: 'created_at' })
  readonly createdAt: Date;

  @Column({ name: 'created_by', type: 'uuid' })
  readonly createdBy: string;

  @Column({ name: 'updated_at' })
  readonly updatedAt: Date;

  @Column({ name: 'updated_by', type: 'uuid' })
  readonly updatedBy: string;
}
