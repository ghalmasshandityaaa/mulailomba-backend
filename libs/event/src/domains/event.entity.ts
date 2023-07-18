import { Entity } from '@mulailomba/common';
import { FileType } from '../entities/typeorm.event.entity';

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
export class EventEntity extends Entity<Props, string> {
  constructor(props: Props, id?: string) {
    super(props, id);
  }

  /**
   *
   * @param props
   * @returns
   */
  public static create(props: CreateEventProps): EventEntity {
    const entity = new EventEntity({
      ...props,
      description: props.description || null,
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
  public static rebuild(props: Props, id: string): EventEntity {
    return new EventEntity(props, id);
  }
}
