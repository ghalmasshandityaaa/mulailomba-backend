import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class eventCategory1690034836116 implements MigrationInterface {
  private table: Table = new Table({
    name: 'event_category',
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
        isNullable: true,
      },
      {
        name: 'price',
        type: 'int',
        default: 0,
        isNullable: false,
      },
      {
        name: 'quota',
        type: 'float',
        default: `'NaN'`,
        isNullable: false,
      },
      {
        name: 'registration_start',
        type: 'timestamptz',
        isNullable: false,
      },
      {
        name: 'registration_end',
        type: 'timestamptz',
        isNullable: false,
      },
      {
        name: 'start_date',
        type: 'timestamptz',
        isNullable: false,
      },
      {
        name: 'end_date',
        type: 'timestamptz',
        isNullable: false,
      },
      {
        name: 'timeline_setting',
        type: 'boolean',
        isNullable: false,
        default: false,
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
        name: 'event_id',
        type: 'uuid',
        isNullable: false,
      },
    ],
  });

  private foreignKey = new TableForeignKey({
    name: 'event_id_fk',
    columnNames: ['event_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'event',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKey(this.table, this.foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.table, this.foreignKey);
    await queryRunner.dropTable(this.table);
  }
}
