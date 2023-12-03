import { DateUtils } from '@mulailomba/common';
import { DatabaseConstraintError, TypeOrmBaseRepository } from '@mulailomba/common/repositories';
import { OrganizerAggregate } from '@mulailomba/organizer/domains';
import { TypeOrmOrganizerEntity } from '@mulailomba/organizer/entities';
import { IOrganizerWriteRepository } from '@mulailomba/organizer/interfaces';
import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeOrmOrganizerWriteRepository
  extends TypeOrmBaseRepository
  implements IOrganizerWriteRepository
{
  readonly driver = 'postgres';
  readonly name = 'TypeOrmOrganizerWriteRepository';

  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly publisher: EventPublisher,
  ) {
    super();
  }

  /**
   *
   * @param entity
   */
  async create(entity: OrganizerAggregate): Promise<void> {
    try {
      try {
        await this.dataSource.createEntityManager().insert(TypeOrmOrganizerEntity, {
          id: entity.id,
          ...entity.props,
        });
      } catch (err) {
        this.handleError(err);
      }
    } catch (err) {
      if (err instanceof DatabaseConstraintError && err.constraint.isUnique) {
        const unix = DateUtils.toUnix(new Date());
        entity.update({ username: `${entity.props.username}-${unix}` });
        await this.create(entity);
        return;
      }
      throw err;
    }
  }

  /**
   *
   * @param entity
   */
  async update(entity: OrganizerAggregate): Promise<void> {
    return this.execute(async () => {
      await this.dataSource
        .createEntityManager()
        .update(TypeOrmOrganizerEntity, { id: entity.id }, { ...entity.props });
    });
  }

  /**
   *
   * @param id
   * @returns
   */
  async findById(id: string): Promise<OrganizerAggregate | undefined> {
    const entity = await this.dataSource
      .createQueryBuilder(TypeOrmOrganizerEntity, 'organizer')
      .where('organizer.id = :id', { id })
      .getOne();

    return entity
      ? this.publisher.mergeObjectContext(OrganizerAggregate.rebuild({ ...entity }, entity.id))
      : undefined;
  }
}
