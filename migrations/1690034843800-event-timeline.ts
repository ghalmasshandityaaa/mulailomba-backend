import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class eventTimeline1690034843800 implements MigrationInterface {
  private table: Table = new Table({
    name: 'event_timeline',
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
        name: 'description',
        type: 'text',
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
        name: 'type',
        type: 'enum',
        enumName: 'event_category_type_enum',
        enum: ['ONLINE', 'OFFLINE', 'INFORMATION'],
        default: `'INFORMATION'`,
        isNullable: false,
      },
      {
        name: 'input',
        type: 'text',
        isNullable: true,
      },
      {
        name: 'additional_file',
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
        name: 'event_category_id',
        type: 'uuid',
        isNullable: false,
      },
    ],
  });

  private foreignKey = new TableForeignKey({
    name: 'event_category_id_fk',
    columnNames: ['event_category_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'event_category',
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
