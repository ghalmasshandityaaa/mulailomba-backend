import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { StringUtils } from '../../../common/src/utils';

export class seedUser1692209374533 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = Array.from({ length: 50 }, () => ({
      id: randomUUID({ disableEntropyCache: true }),
      full_name: faker.person.fullName(),
      phone: faker.phone.number('+628##########'),
      email_address: faker.internet.email(),
      password: StringUtils.hash(faker.internet.password({ length: 16 })),
      is_active: faker.datatype.boolean(),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }));

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user')
      .values(users)
      .orIgnore('code')
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO
  }
}
