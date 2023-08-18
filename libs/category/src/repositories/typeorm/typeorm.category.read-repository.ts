import { TypeOrmCategoryEntity } from '@mulailomba/category/entities/typeorm';
import { CategoryQueryModel, ICategoryReadRepository } from '@mulailomba/category/interfaces';
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

  async findById(id: string): Promise<CategoryQueryModel | undefined> {
    const entity = await this.dataSource
      .createQueryBuilder(TypeOrmCategoryEntity, 'category')
      .where('category.id = :id', { id })
      .getOne();

    return entity || undefined;
  }
}
