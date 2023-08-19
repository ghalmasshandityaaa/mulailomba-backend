import { EventCategoryEntity } from '../domains';

export interface IEventCategoryWriteRepository {
  findByEventId(eventId: string): Promise<EventCategoryEntity[]>;
  save(eventCategories: EventCategoryEntity[]): Promise<void>;
}
