import { v4 } from 'uuid';

export abstract class DomainEvent<T extends Record<string, any>> {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly data: T;

  constructor(data: T) {
    this.id = v4();
    this.timestamp = new Date();
    this.data = data;
  }
}
