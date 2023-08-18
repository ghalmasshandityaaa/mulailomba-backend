import { TypeOrmCategoryEntity } from '@mulailomba/category/entities/typeorm';
import { CategoryQueryModel, ICategoryReadRepository } from '@mulailomba/category/interfaces';
import { IPaginatedQuery, ISearchableQuery, PaginatedCollection } from '@mulailomba/common';
import { BaseReadRepository } from '@mulailomba/common/repositories';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeOrmCategoryReadRepository
  extends BaseReadRepository
  implements ICategoryReadRepository
{
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super();
  }

  /**
   *
   * @param id
   * @returns {CategoryQueryModel}
   */
  async findById(id: string): Promise<CategoryQueryModel | undefined> {
    const entity = await this.dataSource
      .createQueryBuilder(TypeOrmCategoryEntity, 'category')
      .where('category.id = :id', { id })
      .getOne();

    return entity || undefined;
  }

  /**
   *
   * @param params
   * @returns
   */
  async findAll(
    params: IPaginatedQuery & ISearchableQuery,
  ): Promise<PaginatedCollection<CategoryQueryModel>> {
    const { page, pageSize, offset } = this.getPaginationParams(params.page, params.pageSize);

    const query = this.dataSource
      .createQueryBuilder(TypeOrmCategoryEntity, 'category')
      .take(pageSize)
      .skip(offset)
      .orderBy('category.description');

    if (params.searchBy) {
      for (const search of params.searchBy) {
        if ((search.target = 'name')) {
          query.andWhere('category.name ilike :criteria', {
            criteria: `%${search.contains}%`,
          });
        }
        if ((search.target = 'description')) {
          query.andWhere('category.description ilike :criteria', {
            criteria: `%${search.contains}%`,
          });
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
        lastData: entities[entities.length - 1].id,
      },
    };
  }
}
