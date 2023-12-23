import { UserAggregate } from '../domains';

export interface IUserWriteRepository {
  /**
   *
   * @param aggregate
   */
  create(aggregate: UserAggregate): Promise<void>;
}
