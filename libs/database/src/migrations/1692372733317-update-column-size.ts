import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateColumnSize1692372733317 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "event" ALTER COLUMN "name" TYPE varchar(150)');
    await queryRunner.query('ALTER TABLE "event_category" ALTER COLUMN "name" TYPE varchar(150)');
    await queryRunner.query('ALTER TABLE "event_timeline" ALTER COLUMN "name" TYPE varchar(150)');
    await queryRunner.query('ALTER TABLE "event_timeline" ALTER COLUMN "description" TYPE text');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "event" ALTER COLUMN "name" TYPE varchar(50)');
    await queryRunner.query('ALTER TABLE "event_category" ALTER COLUMN "name" TYPE varchar(50)');
    await queryRunner.query('ALTER TABLE "event_timeline" ALTER COLUMN "name" TYPE varchar(50)');
    await queryRunner.query('ALTER TABLE "event_timeline" ALTER COLUMN "description" TYPE text');
  }
}
