import { Entity } from '@mulailomba/common';
import { EVENT_CATEGORY_STATUS_ENUM } from '../event.constants';

type Props = {
  name?: string | null;
  price: number;
  quota: number;
  registrationStart: Date;
  registrationEnd: Date;
  startDate: Date;
  endDate: Date;
  status: EVENT_CATEGORY_STATUS_ENUM;
  timelineSetting: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  eventId: string;
};

export type CreateEventCategoryProps = Required<
  Pick<
    Props,
    | 'price'
    | 'quota'
    | 'registrationStart'
    | 'registrationEnd'
    | 'startDate'
    | 'endDate'
    | 'timelineSetting'
    | 'eventId'
  >
> &
  Partial<Pick<Props, 'name'>>;

/**
 *
 */
export class EventCategoryEntity extends Entity<Props, string> {
  constructor(props: Props, id?: string) {
    super(props, id);
  }

  /**
   *
   * @param props
   * @returns
   */
  public static create(props: CreateEventCategoryProps): EventCategoryEntity {
    const entity = new EventCategoryEntity({
      ...props,
      name: props.name || null,
      status: EVENT_CATEGORY_STATUS_ENUM.DRAFT,
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
  public static rebuild(props: Props, id: string): EventCategoryEntity {
    return new EventCategoryEntity(props, id);
  }
}
