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

    const query = queryRunner.manager.createQueryBuilder().insert().into('user').values(users);

    if (process.env.APP_MODE?.toLowerCase() === 'production') {
      query.values([
        {
          id: randomUUID({ disableEntropyCache: true }),
          full_name: 'Administrator',
          phone: '+6285163636161',
          email_address: 'admin@mulailomba.com',
          password: StringUtils.hash(
            process.env.ADMIN_PASSWORD || faker.internet.password({ length: 16 }),
          ),
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    } else {
      query.values(users);
    }

    await query.orIgnore('code').execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO
  }
}
