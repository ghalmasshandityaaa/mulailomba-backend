import { ISearchableQuery } from '@mulailomba/common';
import { BaseReadRepository } from '@mulailomba/common/repositories';
import { TypeOrmOrganizerEntity } from '@mulailomba/organizer/entities';
import { IOrganizerReadRepository, OrganizerQueryModel } from '@mulailomba/organizer/interfaces';
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
    const query = this.dataSource
      .createQueryBuilder(TypeOrmOrganizerEntity, 'organizer')
      .where('organizer.id = :id', { id });

    if (userId) query.andWhere('organizer.userId = :userId', { userId });

    const entity = await query.getOne();

    return entity || undefined;
  }

  /**
   *
   * @param email
   * @returns
   */
  async findByEmail(email: string): Promise<OrganizerQueryModel | undefined> {
    const entity = await this.dataSource
      .createQueryBuilder(TypeOrmOrganizerEntity, 'organizer')
      .where('organizer.emailAddress = :email', { email })
      .getOne();

    return entity || undefined;
  }

  /**
   *
   * @param username
   * @returns
   */
  async findByUsername(username: string): Promise<OrganizerQueryModel | undefined> {
    const entity = await this.dataSource
      .createQueryBuilder(TypeOrmOrganizerEntity, 'organizer')
      .where('organizer.username = :username', { username })
      .getOne();

    return entity || undefined;
  }

  /**
   *
   * @param userId
   * @param params
   * @returns
   */
  async findByUserId(userId: string, params: ISearchableQuery): Promise<OrganizerQueryModel[]> {
    const query = this.dataSource
      .createQueryBuilder(TypeOrmOrganizerEntity, 'organizer')
      .where('organizer.userId = :userId', { userId });

    if (params.searchBy) {
      for (const search of params.searchBy) {
        if (search.contains) {
          if ((search.target = 'name')) {
            query.andWhere('organizer.name ilike :name', {
              name: `%${search.contains}%`,
            });
          }

          // TODO add more search content below
        }
      }
    }

    const entities = await query.getMany();

    return entities;
  }
}
