import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class activationCode1690034739500 implements MigrationInterface {
  private table: Table = new Table({
    name: 'activation_code',
    columns: [
      {
        name: 'email_address',
        type: 'text',
        isPrimary: true,
      },
      {
        name: 'activation_code',
        type: 'varchar',
        length: '6',
        isNullable: false,
      },
      {
        name: 'created_at',
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
