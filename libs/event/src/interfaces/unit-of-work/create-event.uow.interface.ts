import { IUnitOfWork } from '@mulailomba/common';
import {
  EventAggregate,
  EventCategoryEntity,
  EventPrerequisiteEntity,
  EventTimelineEntity,
} from '@mulailomba/event/domains';

export interface ICreateEventUnitOfWork extends IUnitOfWork {
  saveEvent(event: EventAggregate[]): Promise<void>;
  saveEventCategory(eventCategory: EventCategoryEntity[]): Promise<void>;
  saveEventTimeline(eventTimeline: EventTimelineEntity[]): Promise<void>;
  saveEventPrerequisite(eventPrerequisite: EventPrerequisiteEntity[]): Promise<void>;
}
