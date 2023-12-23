import { Aggregate, StringUtils } from '@mulailomba/common';
import { UserWasCreatedEvent } from './events';

type Props = {
  fullName: string;
  phone: string;
  emailAddress: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserProps = Required<
  Pick<Props, 'fullName' | 'phone' | 'emailAddress' | 'password' | 'isActive'>
>;

/**
 *
 */
export class UserAggregate extends Aggregate<Props, string> {
  constructor(props: Props, id?: string) {
    super(props, id);
  }

  /**
   *
   * @param props
   * @returns
   */
  public static create(props: CreateUserProps): UserAggregate {
    const aggregate = new UserAggregate({
      ...props,
      password: StringUtils.hash(props.password),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    aggregate.raise(
      new UserWasCreatedEvent({
        userId: aggregate.id,
      }),
    );

    return aggregate;
  }

  /**
   *
   * @param props
   * @param id
   * @returns
   */
  public static rebuild(props: Props, id: string): UserAggregate {
    return new UserAggregate(props, id);
  }
}
