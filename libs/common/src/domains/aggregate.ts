import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import { v4 } from 'uuid';

export abstract class Aggregate<
  TProps = Record<string, any>,
  TIdentity extends string | number = string,
> extends AggregateRoot {
  protected readonly _id: TIdentity;
  protected _props: TProps;

  constructor(props: TProps, id?: TIdentity) {
    super();
    this._props = props;
    this._id = id || (v4() as TIdentity);
  }

  protected raise(event: IEvent) {
    this.apply(event);
  }

  get id(): TIdentity {
    return this._id;
  }

  get props(): TProps {
    return this._props;
  }
}
