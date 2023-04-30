import { TypeOrmBaseRepository } from '@aksesaja/common/repositories';
import { UserEntity } from '@aksesaja/user/domains';
import { TypeOrmUserEntity } from '@aksesaja/user/entities';
import { IUserWriteRepository } from '@aksesaja/user/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeOrmUserWriteRepository
  extends TypeOrmBaseRepository
  implements IUserWriteRepository
{
  readonly driver = 'postgres';
  readonly name = 'TypeOrmUserWriteRepository';

  constructor(@InjectDataSource() private dataSource: DataSource) {
    super();
  }

  /**
   *
   * @param entity
   */
  async create(entity: UserEntity): Promise<void> {
    return this.execute(async () => {
      await this.dataSource.createEntityManager().insert(TypeOrmUserEntity, {
        id: entity.id,
        fullName: entity.props.fullName,
        phone: entity.props.phone,
        emailAddress: entity.props.emailAddress,
        password: entity.props.password,
        isActive: entity.props.isActive,
        createdAt: entity.props.createdAt,
        updatedAt: entity.props.updatedAt,
      });
    });
  }
}
