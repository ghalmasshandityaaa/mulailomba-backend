import { faker } from '@faker-js/faker/locale/af_ZA';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedBanner1692271354051 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager
      .createQueryBuilder()
      .select()
      .from('user', 'u')
      .getRawOne();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('banner')
      .values(
        Array.from({ length: 50 }, () => {
          const file = {
            publicId: faker.string.uuid(),
            secureUrl: `https://source.unsplash.com/random`,
          };
          return {
            id: faker.string.uuid(),
            name: faker.word.words({ count: { min: 3, max: 5 } }),
            description: faker.word.words({ count: { min: 10, max: 20 } }),
            position: faker.helpers.arrayElement(['EVENT', 'HOMEPAGE']),
            file,
            start_date: faker.date.recent(),
            end_date: faker.date.soon(),
            status: faker.helpers.arrayElement(['ACTIVE', 'DRAFT', 'EXPIRED', 'INACTIVE']),
            created_at: faker.date.past(),
            updated_at: faker.date.recent(),
            created_by: user.id,
            updated_by: user.id,
          };
        }),
      )
      .orIgnore('code')
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO
  }
}
