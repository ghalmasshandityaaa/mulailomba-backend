import { TypeOrmBannerEntity } from '@mulailomba/banner/entities/typeorm';
import { BannerQueryModel, IBannerReadRepository } from '@mulailomba/banner/interfaces';
import { IFilterableQuery, isEqualsFilterCondition } from '@mulailomba/common';
import { BaseReadRepository } from '@mulailomba/common/repositories';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeOrmBannerReadRepository
  extends BaseReadRepository
  implements IBannerReadRepository
{
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super();
  }

  async findAll(params: IFilterableQuery): Promise<BannerQueryModel[]> {
    const query = this.dataSource.createQueryBuilder(TypeOrmBannerEntity, 'banner');

    if (params.filterBy) {
      for (const filter of params.filterBy) {
        if (isEqualsFilterCondition<string>(filter) && filter.target === 'position') {
          query.where('banner.position = :position', {
            position: filter.equals,
          });
        }
      }
    }

    const entities = await query.getMany();

    return entities.map((entity) => ({ ...entity }));
  }
}
