import { DataSource } from '@mulailomba/banner/entities';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { OrganizerWasLogoutEvent } from '../domains/events';
import { TypeOrmOrganizerEntity } from '../entities';

@EventsHandler(OrganizerWasLogoutEvent)
export class OrganizerWasLogoutListener implements IEventHandler<OrganizerWasLogoutEvent> {
  constructor(
    @InjectPinoLogger(OrganizerWasLogoutListener.name)
    private logger: PinoLogger,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  /**
   *
   * @param event
   */
  async handle(event: OrganizerWasLogoutEvent) {
    this.logger.trace(`BEGIN`);

    await this.dataSource
      .createQueryBuilder()
      .update(TypeOrmOrganizerEntity)
      .set({ logoutAt: new Date() })
      .where('id = :id', { id: event.data.organizerId })
      .execute();

    this.logger.trace(`END`);
  }
}
