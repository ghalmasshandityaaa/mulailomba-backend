import { Entity } from '@mulailomba/common';
import { FileType } from '../entities/typeorm.event.entity';
import { EVENT_TIMELINE_TYPE } from '../event.constants';

type Props = {
  name?: string | null;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  type: EVENT_TIMELINE_TYPE;
  input?: string | null;
  additionalFile?: FileType | null;
  createdAt?: Date;
  updatedAt?: Date;
  eventCategoryId: string;
};

export type CreateEventTimelineProps = Required<Pick<Props, 'type' | 'eventCategoryId'>> &
  Partial<
    Pick<Props, 'name' | 'description' | 'startDate' | 'endDate' | 'additionalFile' | 'input'>
  >;

/**
 *
 */
export class EventTimelineEntity extends Entity<Props, string> {
  constructor(props: Props, id?: string) {
    super(props, id);
  }

  /**
   *
   * @param props
   * @returns
   */
  public static create(props: CreateEventTimelineProps): EventTimelineEntity {
    const entity = new EventTimelineEntity({
      ...props,
      name: props.name || null,
      description: props.description || null,
      startDate: props.startDate || null,
      endDate: props.endDate || null,
      additionalFile: props.additionalFile || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return entity;
  }

  /**
   *
   * @param props
   * @param id
   * @returns
   */
  public static rebuild(props: Props, id: string): EventTimelineEntity {
    return new EventTimelineEntity(props, id);
  }
}
