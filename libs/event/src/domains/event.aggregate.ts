import { Aggregate } from '@mulailomba/common';
import { FileType } from '../entities/typeorm.event.entity';
import { EventPublishEvent } from './events';

type Props = {
  name: string;
  poster: FileType;
  description?: string | null;
  isMultipleCategory: boolean;
  benefit: string[];
  eligibility: string[];
  createdAt?: Date;
  updatedAt?: Date;
  categoryId: string;
  organizerId: string;
};

export type CreateEventProps = Required<
  Pick<
    Props,
    | 'name'
    | 'poster'
    | 'isMultipleCategory'
    | 'benefit'
    | 'eligibility'
    | 'categoryId'
    | 'organizerId'
  >
> &
  Partial<Pick<Props, 'description'>>;

/**
 *
 */
export class EventAggregate extends Aggregate<Props, string> {
  constructor(props: Props, id?: string) {
    super(props, id);
  }

  /**
   *
   * @param props
   * @returns
   */
  public static create(props: CreateEventProps): EventAggregate {
    const aggregate = new EventAggregate({
      ...props,
      description: props.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return aggregate;
  }

  /**
   *
   * @param props
   * @param id
   * @returns
   */
  public static rebuild(props: Props, id: string): EventAggregate {
    return new EventAggregate(props, id);
  }

  /**
   *
   */
  public publishEvent(): void {
    this.raise(
      new EventPublishEvent({
        id: this.id,
      }),
    );
  }
}
