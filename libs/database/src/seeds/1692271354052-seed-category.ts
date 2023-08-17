import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { CategoryFactory } from './factory';

export class seedCategory1692281746818 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager
      .createQueryBuilder()
      .select()
      .from('user', 'u')
      .getRawOne();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('category')
      .values(
        CategoryFactory.map((c) => ({
          id: randomUUID(),
          name: c.name,
          description: c.description,
          created_at: faker.date.past(),
          updated_at: faker.date.recent(),
          created_by: user.id,
          updated_by: user.id,
        })),
      )
      .orIgnore()
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM category WHERE name = ANY($1)`, [
      CategoryFactory.map(({ name }) => name),
    ]);
  }
}
