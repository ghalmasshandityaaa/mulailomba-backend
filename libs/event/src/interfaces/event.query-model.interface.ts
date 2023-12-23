import {
  EVENT_CATEGORY_STATUS_ENUM,
  EVENT_PREREQUISITE_TYPE_ENUM,
  EVENT_TIMELINE_TYPE_ENUM,
} from '../event.constants';

export interface EventQueryModel {
  id: string;
  name: string;
  poster: string;
  description: string | null;
  isMultipleCategory: boolean;
  benefit: string[];
  eligibility: string[];
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  organizerId: string;
  categories: EventCategoryQueryModel[];
  organizer: OrganizerQueryModel;
}

export interface EventCategoryQueryModel {
  id: string;
  name: string | null;
  price: number;
  quota: number;
  registrationStart: Date;
  registrationEnd: Date;
  startDate: Date;
  endDate: Date;
  status: EVENT_CATEGORY_STATUS_ENUM;
  timelineSetting: boolean;
  createdAt: Date;
  updatedAt: Date;
  eventId: string;
  event: EventQueryModel;
  timelines: EventTimelineQueryModel[];
  prerequisites: EventPrerequisiteQueryModel[];
}

export interface EventTimelineQueryModel {
  id: string;
  name: string | null;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  type: EVENT_TIMELINE_TYPE_ENUM;
  input: string | null;
  additionalFile: string | null;
  createdAt: Date;
  updatedAt: Date;
  eventCategoryId: string;
  category: EventCategoryQueryModel;
}

interface EventPrerequisiteQueryModel {
  id: string;
  name: string;
  description: string;
  type: EVENT_PREREQUISITE_TYPE_ENUM;
  answer: string[] | null;
  isRequired: boolean;
  index: number;
  createdAt: Date;
  updatedAt: Date;
  eventCategoryId: string;
  category: EventCategoryQueryModel;
}

interface OrganizerQueryModel {
  id: string;
  name: string;
}
