import { TypeOrmBaseRepository } from '@mulailomba/common/repositories';
import { EventCategoryEntity } from '@mulailomba/event/domains';
import { TypeOrmEventCategoryEntity } from '@mulailomba/event/entities/typeorm.event-cetegory.entity';
import { IEventCategoryWriteRepository } from '@mulailomba/event/interfaces';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class TypeOrmEventCategoryWriteRepository
  extends TypeOrmBaseRepository
  implements IEventCategoryWriteRepository
{
  readonly name = 'TypeOrmEventCategoryWriteRepository';
  readonly driver = 'postgres';

  constructor(@InjectDataSource() private dataSource: DataSource) {
    super();
  }

  async findByEventId(eventId: string): Promise<EventCategoryEntity[]> {
    const entities = await this.dataSource
      .createQueryBuilder(TypeOrmEventCategoryEntity, 'eventCategory')
      .where('eventCategory.eventId = :eventId', { eventId })
      .getMany();

    return entities.map((entity) => EventCategoryEntity.rebuild({ ...entity }, entity.id));
  }

  async save(eventCategories: EventCategoryEntity[]): Promise<void> {
    return this.execute(async () => {
      await this.dataSource.createEntityManager().upsert(
        TypeOrmEventCategoryEntity,
        eventCategories.map((category) => ({ ...category.props, id: category.id })),
        {
          conflictPaths: ['id'],
          skipUpdateIfNoValuesChanged: true,
        },
      );
    });
  }
}
