import { DateUtils, PaginatedCollection } from '@mulailomba/common';
import { PaginatedQueryResult } from '@mulailomba/common/queries';
import { FileType } from '@mulailomba/event/entities/typeorm.event.entity';
import { EVENT_TIMELINE_TYPE } from '@mulailomba/event/event.constants';
import { EventCategoryQueryModel, EventQueryModel } from '@mulailomba/event/interfaces';
import { flattenDeep, orderBy, sortBy, uniq } from 'lodash';

type JsonEventProps = {
  id: string;
  name: string;
  poster: FileType;
  benefits: string[];
  eligibilities: string[];
  status: string;
  quota: string;
  price: string;
  event_start: number;
  event_end: number;
  type: string;
  created_at: number;
  updated_at: number;
};

export class FindEventsByOrganizerIdResult extends PaginatedQueryResult<EventQueryModel> {
  readonly events: JsonEventProps[];

  constructor(collection: PaginatedCollection<EventQueryModel>) {
    super(collection);
    this.events = collection.data.map((data) => this.serialize(data));
  }

  private serialize(data: EventQueryModel): JsonEventProps {
    const quota = sortBy(data.categories, (c) => c.quota).map((c) => c.quota);
    const price = sortBy(data.categories, (c) => c.price).map((c) => c.price);
    const eventDate = this.getEventDate(data.categories);

    return {
      id: data.id,
      name: data.name,
      poster: data.poster,
      benefits: data.benefit,
      eligibilities: data.eligibility,
      status: 'ACTIVE',
      quota: this.toString(quota),
      price: this.toString(price),
      event_start: DateUtils.toUnix(eventDate[0]),
      event_end: DateUtils.toUnix(eventDate[1]),
      type: this.getEventType(data.categories),
      created_at: DateUtils.toUnix(data.createdAt),
      updated_at: DateUtils.toUnix(data.updatedAt),
    };
  }

  private toString(arr: number[]): string {
    if (arr.length === 0) return '';

    const firstValue = arr[0];
    const lastValue = arr[arr.length - 1];

    if (isNaN(firstValue) && isNaN(lastValue)) return 'unlimited';

    return firstValue === lastValue
      ? `${isNaN(firstValue) ? 'unlimited' : firstValue === 0 ? 'free' : firstValue}`
      : `${firstValue === 0 ? 'free' : firstValue} - ${isNaN(lastValue) ? 'unlimited' : lastValue}`;
  }

  private getEventDate(eventCategory: EventCategoryQueryModel[]): [Date, Date] {
    const startDate = orderBy(eventCategory, (c) => c.registrationStart, 'asc').map(
      (c) => c.registrationStart,
    )[0];
    const endDate = orderBy(eventCategory, (c) => c.registrationEnd, 'desc').map(
      (c) => c.registrationEnd,
    )[0];

    return [startDate, endDate];
  }

  private getEventType(eventCategory: EventCategoryQueryModel[]): string {
    const eventTimelines = flattenDeep(eventCategory.map((c) => c.timelines));
    const eventTypes = eventTimelines
      .map((timeline) => timeline.type)
      .filter((type) => type !== EVENT_TIMELINE_TYPE.INFORMATION);

    return uniq(eventTypes.sort()).join(', ');
  }
}
