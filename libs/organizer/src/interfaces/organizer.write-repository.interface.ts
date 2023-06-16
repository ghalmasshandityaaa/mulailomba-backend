import { OrganizerEntity } from '../domains';

export interface IOrganizerWriteRepository {
  /**
   *
   * @param entity
   */
  create(entity: OrganizerEntity): Promise<void>;
}
