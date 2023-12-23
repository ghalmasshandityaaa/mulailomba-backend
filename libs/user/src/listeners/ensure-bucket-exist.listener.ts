import { MinioService } from '@mulailomba/minio';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UserWasCreatedEvent } from '../domains/events';

@EventsHandler(UserWasCreatedEvent)
export class EnsureBucketExistListener implements IEventHandler<UserWasCreatedEvent> {
  constructor(
    @InjectPinoLogger(EnsureBucketExistListener.name)
    private readonly logger: PinoLogger,
    private readonly minio: MinioService,
  ) {}

  /**
   *
   * @param event
   */
  async handle(event: UserWasCreatedEvent) {
    this.logger.trace(`BEGIN`);
    this.logger.debug({ event });

    const userId = event.data.userId;
    const exist = await this.minio.bucketExists(userId);
    if (!exist) {
      await this.minio.createBucket(userId);
    }

    this.logger.trace(`END`);
  }
}
