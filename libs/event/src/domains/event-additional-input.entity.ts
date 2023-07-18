import { Entity } from '@mulailomba/common';
import { EVENT_ADDITIONAL_INPUT_TYPE } from '../event.constants';

type Props = {
  name: string;
  description: string;
  type: EVENT_ADDITIONAL_INPUT_TYPE;
  answer?: string[] | null;
  isRequired: boolean;
  index: number;
  createdAt?: Date;
  updatedAt?: Date;
  eventCategoryId: string;
};

export type CreateAdditionalInputProps = Required<
  Pick<Props, 'name' | 'description' | 'type' | 'isRequired' | 'index' | 'eventCategoryId'>
> &
  Partial<Pick<Props, 'answer'>>;

/**
 *
 */
export class EventAdditionalInputEntity extends Entity<Props, string> {
  constructor(props: Props, id?: string) {
    super(props, id);
  }

  /**
   *
   * @param props
   * @returns
   */
  public static create(props: CreateAdditionalInputProps): EventAdditionalInputEntity {
    const entity = new EventAdditionalInputEntity({
      ...props,
      answer: props.answer || null,
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
  public static rebuild(props: Props, id: string): EventAdditionalInputEntity {
    return new EventAdditionalInputEntity(props, id);
  }
}
