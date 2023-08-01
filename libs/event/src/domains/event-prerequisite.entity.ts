import { Entity } from '@mulailomba/common';
import { EVENT_PREREQUISITE_TYPE } from '../event.constants';

type Props = {
  name: string;
  description: string;
  type: EVENT_PREREQUISITE_TYPE;
  answer?: string[] | null;
  isRequired: boolean;
  index: number;
  createdAt?: Date;
  updatedAt?: Date;
  eventCategoryId: string;
};

export type CreatePrerequisiteProps = Required<
  Pick<Props, 'name' | 'description' | 'type' | 'isRequired' | 'index' | 'eventCategoryId'>
> &
  Partial<Pick<Props, 'answer'>>;

/**
 *
 */
export class EventPrerequisiteEntity extends Entity<Props, string> {
  constructor(props: Props, id?: string) {
    super(props, id);
  }

  /**
   *
   * @param props
   * @returns
   */
  public static create(props: CreatePrerequisiteProps): EventPrerequisiteEntity {
    const entity = new EventPrerequisiteEntity({
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
  public static rebuild(props: Props, id: string): EventPrerequisiteEntity {
    return new EventPrerequisiteEntity(props, id);
  }
}
