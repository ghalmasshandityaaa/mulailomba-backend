import { faker } from '@faker-js/faker';
import { addDays, addMonths } from 'date-fns';
import { chunk } from 'lodash';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class seedEvent1692277347451 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [organizers, categories] = await Promise.all([
      queryRunner.manager.createQueryBuilder().select().from('organizer', 'o').getRawMany(),
      queryRunner.manager.createQueryBuilder().select().from('category', 'c').getRawMany(),
    ]);

    const categoryIds = categories.map((v) => v.id);

    const events: any[] = [];
    const eventCategories: any[] = [];
    const eventPrerequisite: any[] = [];
    const eventTimelines: any[] = [];
    organizers.forEach((o) => {
      Array.from({ length: 25 }, () => {
        const file = {
          publicId: faker.string.uuid(),
          secureUrl: `https://source.unsplash.com/random`,
        };
        const multipleCategory = faker.datatype.boolean();
        const event = {
          id: faker.string.uuid(),
          name: faker.lorem.words({ min: 2, max: 3 }),
          description: faker.word.words({ count: { min: 10, max: 20 } }),
          poster: file,
          is_multiple_category: multipleCategory,
          benefits: JSON.stringify(
            Array.from({ length: 3 }, () => faker.word.words({ count: { min: 3, max: 5 } })),
          ),
          eligibilities: faker.helpers.arrayElement(['SD', 'SMP', 'SMA', 'MAHASISWA', 'UMUM']),
          created_at: faker.date.past(),
          updated_at: faker.date.recent(),
          organizer_id: o.id,
          category_id: faker.helpers.arrayElement(categoryIds),
        };

        events.push(event);

        Array.from({ length: multipleCategory ? 5 : 1 }, () => {
          const timelineSetting = faker.datatype.boolean();

          const registration_start = faker.date.recent();
          const registration_end = faker.date.between({
            from: registration_start,
            to: faker.date.future(),
          });
          const start_date = addDays(registration_end, 1);
          const end_date = addMonths(start_date, 1);

          const event_category = {
            id: faker.string.uuid(),
            name: multipleCategory ? faker.word.words({ count: { min: 2, max: 3 } }) : null,
            price: faker.helpers.arrayElement([
              0,
              Number(faker.commerce.price({ min: 10000, max: 100000 })),
            ]),
            quota: faker.helpers.arrayElement(['NaN', faker.number.int({ min: 10, max: 1000 })]),
            registration_start,
            registration_end,
            start_date,
            end_date,
            timeline_setting: timelineSetting,
            created_at: faker.date.past(),
            updated_at: faker.date.recent(),
            event_id: event.id,
            status: faker.helpers.arrayElement([
              'DRAFT',
              'UPCOMING',
              'PUBLISHED',
              'ONGOING',
              'FINISHED',
              'ARCHIVED',
            ]),
          };

          eventCategories.push(event_category);

          let index = 0;
          Array.from({ length: 5 }, () => {
            const type = faker.helpers.arrayElement([
              'INPUT',
              'FILE',
              'TEXT_AREA',
              'SINGLE',
              'MULTIPLE',
            ]);
            eventPrerequisite.push({
              id: faker.string.uuid(),
              name: faker.word.words({ count: { min: 3, max: 5 } }),
              description: faker.word.words({ count: { min: 10, max: 20 } }),
              type,
              answer: ['SINGLE', 'MULTIPLE'].includes(type)
                ? JSON.stringify(
                    Array.from({ length: 5 }, () =>
                      faker.word.words({ count: { min: 3, max: 5 } }),
                    ),
                  )
                : [],
              is_required: faker.datatype.boolean(),
              index: index++,
              created_at: faker.date.past(),
              updated_at: faker.date.recent(),
              event_category_id: event_category.id,
            });
          });

          Array.from({ length: timelineSetting ? 5 : 1 }, () => {
            const type = faker.helpers.arrayElement(['ONLINE', 'OFFLINE', 'INFORMATION']);
            eventTimelines.push({
              id: faker.string.uuid(),
              name: timelineSetting ? faker.word.words({ count: { min: 2, max: 3 } }) : null,
              description: timelineSetting ? faker.word.words({ count: { min: 5, max: 10 } }) : '',
              start_date: faker.date.past(),
              end_date: faker.date.future(),
              type,
              input:
                type === 'ONLINE'
                  ? faker.internet.url()
                  : type === 'OFFLINE'
                  ? faker.location.streetAddress()
                  : faker.word.words({ count: { min: 5, max: 10 } }),
              additional_file: type === 'INFORMATION' ? file : null,
              created_at: faker.date.past(),
              updated_at: faker.date.recent(),
              event_category_id: event_category.id,
            });
          });
        });
      });
    });

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('event')
      .values(events)
      .orIgnore('username')
      .execute();

    console.log(`Successfully insert ${events.length} data events`);

    const batch = 2500;
    const event_category_batches = chunk(eventCategories, batch);
    for (const category of event_category_batches) {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('event_category')
        .values(category)
        .execute();
    }

    console.log(`Successfully insert ${eventCategories.length} data event_category`);

    const event_prerequisite_batches = chunk(eventPrerequisite, batch);
    for (const prerequisite of event_prerequisite_batches) {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('event_prerequisite')
        .values(prerequisite)
        .execute();
    }

    console.log(`Successfully insert ${eventPrerequisite.length} data event_prerequisite`);

    const event_timeline_batches = chunk(eventTimelines, batch);
    for (const timeline of event_timeline_batches) {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('event_timeline')
        .values(timeline)
        .execute();
    }

    console.log(`Successfully insert ${eventTimelines.length} data event_timeline`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO
  }
}
