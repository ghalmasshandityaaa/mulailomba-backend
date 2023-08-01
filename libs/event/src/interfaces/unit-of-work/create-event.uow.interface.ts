import { IUnitOfWork } from '@mulailomba/common';
import {
  EventCategoryEntity,
  EventEntity,
  EventPrerequisiteEntity,
  EventTimelineEntity,
} from '@mulailomba/event/domains';

export interface ICreateEventUnitOfWork extends IUnitOfWork {
  saveEvent(event: EventEntity[]): Promise<void>;
  saveEventCategory(eventCategory: EventCategoryEntity[]): Promise<void>;
  saveEventTimeline(eventTimeline: EventTimelineEntity[]): Promise<void>;
  saveEventPrerequisite(eventPrerequisite: EventPrerequisiteEntity[]): Promise<void>;
}
