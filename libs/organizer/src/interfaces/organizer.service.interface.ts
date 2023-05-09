import { OrganizerQueryModel } from './organizer.query-model.interface';

export interface IOrganizerService {
  findById(id: string, userId?: string): Promise<OrganizerQueryModel | undefined>;
}
