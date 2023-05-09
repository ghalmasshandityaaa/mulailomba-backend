import { OrganizerQueryModel } from './organizer.query-model.interface';

export interface IOrganizerReadRepository {
  /**
   *
   * @param id
   * @returns
   */
  findById(id: string, userId?: string): Promise<OrganizerQueryModel | undefined>;
}
