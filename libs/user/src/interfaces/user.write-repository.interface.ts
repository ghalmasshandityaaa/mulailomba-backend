import { UserEntity } from '../domains';

export interface IUserWriteRepository {
  /**
   *
   * @param entity
   */
  create(entity: UserEntity): Promise<void>;
}
