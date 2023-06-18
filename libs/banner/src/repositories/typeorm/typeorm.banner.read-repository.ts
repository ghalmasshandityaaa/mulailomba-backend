import { TypeOrmBannerEntity } from '@mulailomba/banner/entities/typeorm';
import { BannerQueryModel, IBannerReadRepository } from '@mulailomba/banner/interfaces';
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

  async findAll(): Promise<BannerQueryModel[]> {
    const entities = await this.dataSource.createEntityManager().find(TypeOrmBannerEntity);

    return entities.map((entity) => ({ ...entity }));
  }
}
