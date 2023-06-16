import { DateUtils } from '@mulailomba/common';
import { DatabaseConstraintError, TypeOrmBaseRepository } from '@mulailomba/common/repositories';
import { OrganizerEntity } from '@mulailomba/organizer/domains';
import { TypeOrmOrganizerEntity } from '@mulailomba/organizer/entities';
import { IOrganizerWriteRepository } from '@mulailomba/organizer/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TypeOrmOrganizerWriteRepository
  extends TypeOrmBaseRepository
  implements IOrganizerWriteRepository
{
  readonly driver = 'postgres';
  readonly name = 'TypeOrmOrganizerWriteRepository';

  constructor(@InjectDataSource() private dataSource: DataSource) {
    super();
  }

  /**
   *
   * @param entity
   */
  async create(entity: OrganizerEntity): Promise<void> {
    try {
      try {
        await this.dataSource.createEntityManager().insert(TypeOrmOrganizerEntity, {
          id: entity.id,
          ...entity.props,
        });
      } catch (err) {
        this.handleError(err);
      }
    } catch (err) {
      if (err instanceof DatabaseConstraintError && err.constraint.isUnique) {
        const unix = DateUtils.toUnix(new Date());
        entity.update({ username: `${entity.props.username}-${unix}` });
        await this.create(entity);
        return;
      }
      throw err;
    }
  }
}
