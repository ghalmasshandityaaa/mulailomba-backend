import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class eventPrerequisite1690034852061 implements MigrationInterface {
  private table: Table = new Table({
    name: 'event_prerequisite',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      },
      {
        name: 'name',
        type: 'text',
        isNullable: false,
      },
      {
        name: 'description',
        type: 'text',
        isNullable: false,
      },
      {
        name: 'type',
        type: 'enum',
        enumName: 'event_prerequisite_type_enum',
        enum: ['INPUT', 'FILE', 'TEXT_AREA', 'SINGLE', 'MULTIPLE'],
        default: `'INPUT'`,
        isNullable: false,
      },
      {
        name: 'answer',
        type: 'text',
        isNullable: false,
      },
      {
        name: 'is_required',
        type: 'boolean',
        default: false,
        isNullable: false,
      },
      {
        name: 'index',
        type: 'int',
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
