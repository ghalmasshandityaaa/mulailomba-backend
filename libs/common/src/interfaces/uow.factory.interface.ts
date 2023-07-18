import { IUnitOfWork } from './uow.interface';

export interface IUnitOfWorkFactory<T extends IUnitOfWork> {
  create(): T;
}
