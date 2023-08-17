import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class wishlist1690034829797 implements MigrationInterface {
  private table: Table = new Table({
    name: 'wishlist',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      },
      {
        name: 'created_at',
        type: 'timestamptz',
        default: 'now()',
        isNullable: false,
      },
      {
        name: 'updated_at',
        type: 'timestamptz',
        default: 'now()',
        isNullable: false,
      },
      {
        name: 'collection_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'event_id',
        type: 'uuid',
        isNullable: false,
      },
    ],
  });

  private collectionFK = new TableForeignKey({
    name: 'collection_id_fk',
    columnNames: ['collection_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'wishlist_collection',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  private eventFK = new TableForeignKey({
    name: 'event_id_fk',
    columnNames: ['event_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'event',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKey(this.table, this.collectionFK);
    await queryRunner.createForeignKey(this.table, this.eventFK);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.table, this.collectionFK);
    await queryRunner.dropForeignKey(this.table, this.eventFK);
    await queryRunner.dropTable(this.table);
  }
}
