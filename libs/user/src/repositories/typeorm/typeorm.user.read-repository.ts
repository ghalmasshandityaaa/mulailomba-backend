import { BaseReadRepository } from '@mulailomba/common/repositories';
import { TypeOrmUserEntity } from '@mulailomba/user/entities';
import { IUserReadRepository, UserQueryModel } from '@mulailomba/user/interfaces';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class TypeOrmUserReadRepository extends BaseReadRepository implements IUserReadRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super();
  }

  /**
   *
   * @param id
   * @returns
   */
  async findById(id: string): Promise<UserQueryModel | undefined> {
    const entity = await this.dataSource
      .createQueryBuilder(TypeOrmUserEntity, 'user')
      .where('user.id = :id', { id })
      .getOne();

    return entity || undefined;
  }

  /**
   *
   * @param email
   * @returns
   */
  async findByEmail(emailAddress: string): Promise<UserQueryModel | undefined> {
    const entity = await this.dataSource
      .createQueryBuilder(TypeOrmUserEntity, 'user')
      .where('user.emailAddress = :emailAddress', { emailAddress })
      .getOne();

    return entity || undefined;
  }
}
