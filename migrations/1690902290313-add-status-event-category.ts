import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addStatusEventCategory1690902290313 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('event_category', [
      new TableColumn({
        name: 'status',
        type: 'varchar',
        length: '15',
        isNullable: false,
        enum: ['DRAFT', 'UPCOMING', 'PUBLISHED', 'ONGOING', 'FINISHED', 'ARCHIVED'],
        enumName: 'event_category_status_enum',
        default: `'DRAFT'`,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('event_category', 'status');
  }
}
