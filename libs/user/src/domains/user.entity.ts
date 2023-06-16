import { Entity, StringUtils } from '@mulailomba/common';

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
export class UserEntity extends Entity<Props, string> {
  constructor(props: Props, id?: string) {
    super(props, id);
  }

  /**
   *
   * @param props
   * @returns
   */
  public static create(props: CreateUserProps): UserEntity {
    const entity = new UserEntity({
      ...props,
      password: StringUtils.hash(props.password),
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
  public static rebuild(props: Props, id: string): UserEntity {
    return new UserEntity(props, id);
  }
}
