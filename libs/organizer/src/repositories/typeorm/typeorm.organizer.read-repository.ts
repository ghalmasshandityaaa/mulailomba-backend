import { ISearchableQuery, ISortableQuery } from '@mulailomba/common';
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
  async findByUserId(
    userId: string,
    params: ISearchableQuery & ISortableQuery,
  ): Promise<(OrganizerQueryModel & { totalEvent?: number })[]> {
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

    if (params.sortBy) {
      for (const sort of params.sortBy) {
        if (sort.target === 'name') {
          query.addOrderBy('organizer.name', sort.direction);
        }
        if (sort.target === 'activity') {
          query.addOrderBy('organizer.logoutAt', sort.direction);
        }
        if (sort.target === 'total_event') {
          query
            .leftJoin('organizer.events', 'event')
            .addSelect('count(event.*)', 'total')
            .addGroupBy('organizer.id')
            .addOrderBy('total', sort.direction);
        }
        // TODO add more sort content below
      }
    }

    const entities = await query.getRawMany();

    return entities.map((entity) => ({
      id: entity.organizer_id,
      name: entity.organizer_name,
      username: entity.organizer_username,
      profile: entity.organizer_profile,
      background: entity.organizer_background,
      emailAddress: entity.organizer_email_address,
      password: entity.organizer_password,
      isLocked: entity.organizer_is_locked,
      isActive: entity.organizer_is_active,
      isFavorite: entity.organizer_is_favorite,
      createdAt: entity.organizer_created_at,
      updatedAt: entity.organizer_updated_at,
      logoutAt: entity.organizer_logout_at,
      userId: entity.organizer_user_id,
      totalEvent: entity.total ? Number(entity.total) : undefined,
    }));
  }
}
