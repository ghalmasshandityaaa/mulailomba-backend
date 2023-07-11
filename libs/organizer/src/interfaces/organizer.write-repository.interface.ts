import { OrganizerAggregate } from '../domains';

export interface IOrganizerWriteRepository {
  /**
   *
   * @param entity
   */
  create(entity: OrganizerAggregate): Promise<void>;

  /**
   *
   * @param id
   * @returns
   */
  findById(id: string): Promise<OrganizerAggregate | undefined>;
}
