import { UserQueryModel } from './user.query-model.interface';

export interface IUserReadRepository {
  /**
   *
   * @param id
   * @returns
   */
  findById(id: string): Promise<UserQueryModel | undefined>;
  /**
   *
   * @param email
   * @returns
   */
  findByEmail(email: string): Promise<UserQueryModel | undefined>;
}
