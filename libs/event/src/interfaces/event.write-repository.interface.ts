import { EventAggregate } from '../domains';

export interface IEventWriteRepository {
  findById(id: string, organizerId?: string): Promise<EventAggregate | undefined>;
}
