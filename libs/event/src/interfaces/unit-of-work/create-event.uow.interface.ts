import { IUnitOfWork } from '@mulailomba/common';
import {
  EventAdditionalInputEntity,
  EventCategoryEntity,
  EventEntity,
  EventTimelineEntity,
} from '@mulailomba/event/domains';

export interface ICreateEventUnitOfWork extends IUnitOfWork {
  saveEvent(event: EventEntity[]): Promise<void>;
  saveEventCategory(eventCategory: EventCategoryEntity[]): Promise<void>;
  saveEventTimeline(eventTimeline: EventTimelineEntity[]): Promise<void>;
  saveEventAdditionalInput(eventAdditionalInput: EventAdditionalInputEntity[]): Promise<void>;
}
