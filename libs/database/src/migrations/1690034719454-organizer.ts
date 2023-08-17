import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class organizer1690034719454 implements MigrationInterface {
  private table: Table = new Table({
    name: 'organizer',
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
        name: 'username',
        type: 'text',
        isNullable: false,
        isUnique: true,
      },
      {
        name: 'profile',
        type: 'text',
        isNullable: true,
      },
      {
        name: 'background',
        type: 'text',
        isNullable: true,
      },
      {
        name: 'email_address',
        type: 'text',
        isNullable: false,
      },
      {
        name: 'password',
        type: 'text',
        isNullable: true,
      },
      {
        name: 'is_locked',
        type: 'boolean',
        isNullable: false,
        default: false,
      },
      {
        name: 'is_active',
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
        name: 'logout_at',
        type: 'timestamptz',
        isNullable: true,
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

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKey(this.table, this.foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.table, this.foreignKey);
    await queryRunner.dropTable(this.table);
  }
}
