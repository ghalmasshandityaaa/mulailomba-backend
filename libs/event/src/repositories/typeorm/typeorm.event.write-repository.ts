import { EventAggregate } from '@mulailomba/event/domains';
import { TypeOrmEventEntity } from '@mulailomba/event/entities/typeorm.event.entity';
import { IEventWriteRepository } from '@mulailomba/event/interfaces';
import { EventPublisher } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class TypeOrmEventWriteRepository implements IEventWriteRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly publisher: EventPublisher,
  ) {}

  async findById(id: string, organizerId?: string): Promise<EventAggregate | undefined> {
    const query = this.dataSource
      .createQueryBuilder(TypeOrmEventEntity, 'event')
      .where('event.id = :id', { id });

    if (organizerId) query.andWhere('event.organizerId = :organizerId', { organizerId });

    const entity = await query.getOne();

    return entity
      ? this.publisher.mergeObjectContext(EventAggregate.rebuild({ ...entity }, entity.id))
      : undefined;
  }
}
