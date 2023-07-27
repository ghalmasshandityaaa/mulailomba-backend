import {
  IFilterableQuery,
  IPaginatedQuery,
  ISearchableQuery,
  isEqualsFilterCondition,
  isInFilterCondition,
  ISortableQuery,
  PaginatedCollection,
} from '@mulailomba/common';
import { BaseReadRepository } from '@mulailomba/common/repositories';
import { TypeOrmEventEntity } from '@mulailomba/event/entities/typeorm.event.entity';
import { EventQueryModel, IEventReadRepository } from '@mulailomba/event/interfaces';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class TypeOrmEventReadRepository extends BaseReadRepository implements IEventReadRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super();
  }

  async findByOrganizerId(
    organizerId: string,
    params: IPaginatedQuery & ISortableQuery & IFilterableQuery & ISearchableQuery,
  ): Promise<PaginatedCollection<EventQueryModel>> {
    const { page, pageSize, offset } = this.getPaginationParams(params.page, params.pageSize);

    const query = this.dataSource
      .createQueryBuilder(TypeOrmEventEntity, 'event')
      .innerJoinAndSelect('event.categories', 'categories')
      .innerJoinAndSelect('categories.timelines', 'timelines')
      .where('event.organizerId = :organizerId', { organizerId })
      .take(pageSize)
      .skip(offset);

    if (params.searchBy) {
      for (const search of params.searchBy) {
        if ((search.target = 'name')) {
          query.andWhere('event.name ilike :criteria', {
            criteria: `%${search.contains}%`,
          });
        }
      }
    }

    if (params.filterBy) {
      for (const filter of params.filterBy) {
        if (filter.target === 'status') {
          if (isEqualsFilterCondition<string>(filter)) {
            query.andWhere('users.roleId = :roleId', { roleId: filter.equals });
          } else if (isInFilterCondition<string>(filter)) {
            query.andWhere('users.roleId IN (:...roleId)', {
              roleId: filter.in,
            });
          }
        }
        if (isEqualsFilterCondition<boolean>(filter) && filter.target === 'isActive') {
          query.andWhere('users.isActive = :isActive', {
            isActive: filter.equals,
          });
        }
      }
    }

    if (params.sortBy) {
      for (const sort of params.sortBy) {
        if (sort.target === 'name') {
          query.addOrderBy('event.name', sort.direction);
        } else {
          query.addOrderBy(`event.${sort.target}`, sort.direction);
        }
      }
    }

    const [entities, count] = await query.getManyAndCount();

    return {
      data: entities.map((entity) => ({ ...entity })),
      metadata: {
        page: page,
        pageSize: pageSize,
        totalCount: count,
      },
    };
  }
}
