import { OrganizerQueryModel } from './organizer.query-model.interface';

export interface IOrganizerReadRepository {
  /**
   *
   * @param id
   * @returns
   */
  findById(id: string, userId?: string): Promise<OrganizerQueryModel | undefined>;
  /**
   *
   * @param email
   * @returns
   */
  findByEmail(email: string): Promise<OrganizerQueryModel | undefined>;
  /**
   *
   * @param username
   * @returns
   */
  findByUsername(username: string): Promise<OrganizerQueryModel | undefined>;
  /**
   *
   * @param userId
   * @returns
   */
  findByUserId(userId: string): Promise<OrganizerQueryModel[]>;
}
