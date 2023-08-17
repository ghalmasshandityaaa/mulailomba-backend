import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';

export class wishlistCollection1690034790570 implements MigrationInterface {
  private table: Table = new Table({
    name: 'wishlist_collection',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      },
      {
        name: 'name',
        type: 'varchar',
        length: '16',
        isNullable: false,
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
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      },
    ],
  });

  private foreignKey = new TableForeignKey({
    name: 'user_id_fk',
    columnNames: ['user_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'user',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  private wishlistCollectionUnique = new TableUnique({
    name: 'wishlist_collection_unique',
    columnNames: ['user_id', 'name'],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKey(this.table, this.foreignKey);
    await queryRunner.createUniqueConstraint(this.table, this.wishlistCollectionUnique);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(this.table, this.wishlistCollectionUnique);
    await queryRunner.dropForeignKey(this.table, this.foreignKey);
    await queryRunner.dropTable(this.table);
  }
}
