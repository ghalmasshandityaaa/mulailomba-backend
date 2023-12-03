import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFavoriteOrganizer1701580374931 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('organizer', [
      new TableColumn({
        name: 'is_favorite',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('organizer', 'is_favorite');
  }
}
