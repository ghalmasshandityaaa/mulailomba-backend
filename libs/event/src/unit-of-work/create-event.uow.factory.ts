import { IUnitOfWorkFactory } from '@mulailomba/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ICreateEventUnitOfWork } from '../interfaces/unit-of-work';
import { CreateEventUnitOfWork } from './create-event.uow';

export class CreateEventUnitOfWorkFactory implements IUnitOfWorkFactory<ICreateEventUnitOfWork> {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  create(): ICreateEventUnitOfWork {
    return new CreateEventUnitOfWork(this.dataSource);
  }
}
