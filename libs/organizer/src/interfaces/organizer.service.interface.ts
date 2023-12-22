import { OrganizerAggregate } from '../domains';
import { OrganizerQueryModel } from './organizer.query-model.interface';

export interface IOrganizerService {
  findById(id: string, userId?: string): Promise<OrganizerQueryModel | undefined>;
  findByEmail(email: string): Promise<OrganizerQueryModel | undefined>;
  create(aggregate: OrganizerAggregate): Promise<void>;
  findAggregateById(id: string): Promise<OrganizerAggregate | undefined>;
}
