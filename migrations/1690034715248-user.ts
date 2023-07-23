import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class user1690034715248 implements MigrationInterface {
  private table: Table = new Table({
    name: 'user',
    columns: [
      {
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      },
      {
        name: 'full_name',
        type: 'varchar',
        length: '50',
        isNullable: false,
      },
      {
        name: 'phone',
        type: 'varchar',
        length: '16',
        isNullable: false,
        isUnique: true,
      },
      {
        name: 'email_address',
        type: 'text',
        isNullable: false,
      },
      {
        name: 'password',
        type: 'text',
        isNullable: false,
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
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
