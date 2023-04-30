import { v4 } from 'uuid';

export abstract class Entity<
  TProps = Record<string, any>,
  TIdentity extends string | number = string,
> {
  protected readonly _id: TIdentity;
  protected _props: TProps;

  constructor(props: TProps, id?: TIdentity) {
    this._props = props;
    this._id = id || (v4() as TIdentity);
  }

  get id(): TIdentity {
    return this._id;
  }

  get props(): TProps {
    return this._props;
  }
}
