import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class event1690034806823 implements MigrationInterface {
  private table: Table = new Table({
    name: 'event',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      },
      {
        name: 'name',
        type: 'varchar',
        length: '50',
        isNullable: false,
      },
      {
        name: 'description',
        type: 'text',
        isNullable: true,
      },
      {
        name: 'poster',
        type: 'text',
        isNullable: false,
      },
      {
        name: 'is_multiple_category',
        type: 'boolean',
        isNullable: false,
        default: false,
      },
      {
        name: 'benefits',
        type: 'text',
        isNullable: true,
      },
      {
        name: 'eligibilities',
        type: 'text',
        isNullable: true,
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
        name: 'organizer_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'category_id',
        type: 'uuid',
        isNullable: false,
      },
    ],
  });

  private organizerFK = new TableForeignKey({
    name: 'organizer_id_fk',
    columnNames: ['organizer_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'organizer',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  private categoryFK = new TableForeignKey({
    name: 'category_id_fk',
    columnNames: ['category_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'category',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKey(this.table, this.organizerFK);
    await queryRunner.createForeignKey(this.table, this.categoryFK);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.table, this.organizerFK);
    await queryRunner.dropForeignKey(this.table, this.categoryFK);
    await queryRunner.dropTable(this.table);
  }
}
