import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class eventEligibility1690034783474 implements MigrationInterface {
  private table: Table = new Table({
    name: 'event_eligibility',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      },
      {
        name: 'label',
        type: 'varchar',
        length: '25',
        isNullable: false,
      },
      {
        name: 'description',
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
        name: 'created_by',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'updated_by',
        type: 'uuid',
        isNullable: false,
      },
    ],
  });

  private createdFK = new TableForeignKey({
    name: 'created_by_fk',
    columnNames: ['created_by'],
    referencedColumnNames: ['id'],
    referencedTableName: 'user',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });

  private updatedFK = new TableForeignKey({
    name: 'updated_by_fk',
    columnNames: ['updated_by'],
    referencedColumnNames: ['id'],
    referencedTableName: 'user',
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKey(this.table, this.createdFK);
    await queryRunner.createForeignKey(this.table, this.updatedFK);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.table, this.createdFK);
    await queryRunner.dropForeignKey(this.table, this.updatedFK);
    await queryRunner.dropTable(this.table);
  }
}
