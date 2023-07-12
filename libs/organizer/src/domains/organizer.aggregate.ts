import { Aggregate, StringUtils } from '@mulailomba/common';
import { kebabCase } from 'lodash';
import { OrganizerWasLogoutEvent } from './events';

type Props = {
  name: string;
  username: string;
  profile?: string;
  banner?: string;
  emailAddress: string;
  password: string;
  isLocked: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  logoutAt?: Date;
  userId: string;
};

export type CreateOrganizerProps = Required<
  Pick<Props, 'name' | 'emailAddress' | 'password' | 'isLocked' | 'userId'>
> &
  Partial<Pick<Props, 'profile' | 'banner'>>;

type UpdatableProps = Partial<
  Pick<Props, 'name' | 'username' | 'profile' | 'banner' | 'password' | 'isLocked' | 'isActive'>
>;

/**
 *
 */
export class OrganizerAggregate extends Aggregate<Props, string> {
  constructor(props: Props, id?: string) {
    super(props, id);
  }

  /**
   *
   * @param props
   * @returns
   */
  public static create(props: CreateOrganizerProps): OrganizerAggregate {
    const entity = new OrganizerAggregate({
      ...props,
      username: kebabCase(props.name),
      password: props.password ? StringUtils.hash(props.password) : props.password,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return entity;
  }

  public update(props: UpdatableProps): void {
    this.props.name = props.name || this.props.name;
    this.props.profile = props.profile || this.props.profile;
    this.props.banner = props.banner || this.props.banner;
    this.props.password = props.password ? StringUtils.hash(props.password) : this.props.password;
    this.props.isLocked = props.isLocked || this.props.isLocked;
    this.props.isActive = props.isActive || this.props.isActive;
    this.props.updatedAt = new Date();

    if (props.username) {
      this.props.username = props.username;
    } else {
      if (props.name && props.name !== this.props.name) {
        this.props.username = kebabCase(props.name);
      }
    }
  }

  public logout(): void {
    this.raise(new OrganizerWasLogoutEvent({ organizerId: this.id }));
  }

  /**
   *
   * @param props
   * @param id
   * @returns
   */
  public static rebuild(props: Props, id: string): OrganizerAggregate {
    return new OrganizerAggregate(props, id);
  }
}
