import { OrganizerAggregate } from '../domains';

export interface IOrganizerWriteRepository {
  // write
  /**
   *
   * @param entity
   */
  create(entity: OrganizerAggregate): Promise<void>;

  /**
   *
   * @param entity
   */
  update(entity: OrganizerAggregate): Promise<void>;

  // read
  /**
   *
   * @param id
   * @returns
   */
  findById(id: string): Promise<OrganizerAggregate | undefined>;
}
