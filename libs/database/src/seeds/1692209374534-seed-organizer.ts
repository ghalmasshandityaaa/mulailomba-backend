import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { flattenDeep } from 'lodash';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { StringUtils } from '../../../common/src/utils';

export class seedOrganizer1692209374534 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.manager
      .createQueryBuilder()
      .select()
      .from('user', 'u')
      .getRawMany();

    const organizers = users.map((u) => {
      const file = {
        publicId: faker.string.uuid(),
        secureUrl: `https://source.unsplash.com/random`,
      };
      const isLocked = faker.datatype.boolean();
      const organizer = Array.from({ length: 3 }, () => ({
        id: randomUUID(),
        name: faker.company.name(),
        username: faker.lorem.slug(3),
        profile: JSON.stringify(file),
        background: JSON.stringify(file),
        email_address: faker.internet.email(),
        password: isLocked ? StringUtils.hash(faker.internet.password({ length: 16 })) : null,
        is_locked: isLocked,
        is_active: faker.datatype.boolean(),
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
        logout_at: null,
        user_id: u.id,
      }));
      return organizer;
    });

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('organizer')
      .values(flattenDeep(organizers))
      .orIgnore('username')
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO
  }
}
