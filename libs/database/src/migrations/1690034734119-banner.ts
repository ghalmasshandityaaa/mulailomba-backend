import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class banner1690034734119 implements MigrationInterface {
  private table: Table = new Table({
    name: 'banner',
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
        name: 'position',
        type: 'enum',
        isNullable: false,
        enum: ['EVENT', 'HOMEPAGE'],
        enumName: 'banner_position_enum',
        default: `'HOMEPAGE'`,
      },
      {
        name: 'file',
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
        name: 'status',
        type: 'text',
        isNullable: false,
        enum: ['ACTIVE', 'DRAFT', 'EXPIRED', 'INACTIVE'],
        enumName: 'banner_status_enum',
        default: `'ACTIVE'`,
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
