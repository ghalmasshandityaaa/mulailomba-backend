import { BaseReadRepository } from '@aksesaja/common/repositories';
import { TypeOrmOrganizerEntity } from '@aksesaja/organizer/entities';
import { IOrganizerReadRepository, OrganizerQueryModel } from '@aksesaja/organizer/interfaces';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class TypeOrmOrganizerReadRepository
  extends BaseReadRepository
  implements IOrganizerReadRepository
{
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super();
  }

  /**
   *
   * @param id
   * @returns
   */
  async findById(id: string, userId?: string): Promise<OrganizerQueryModel | undefined> {
    const query = await this.dataSource
      .createQueryBuilder(TypeOrmOrganizerEntity, 'organizer')
      .where('organizer.id = :id', { id });

    if (userId) query.andWhere('organizer.userId = :userId', { userId });

    const entity = await query.getOne();

    return entity || undefined;
  }
}
