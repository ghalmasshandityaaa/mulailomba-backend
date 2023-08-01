import { IUnitOfWorkFactory } from '@mulailomba/common';
import {
  EventCategoryEntity,
  EventEntity,
  EventPrerequisiteEntity,
  EventTimelineEntity,
} from '@mulailomba/event/domains';
import { CREATE_EVENT_UNIT_OF_WORK_FACTORY } from '@mulailomba/event/event.constants';
import { ICreateEventUnitOfWork } from '@mulailomba/event/interfaces/unit-of-work';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateEventCommand } from './create-event.command';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand, void> {
  constructor(
    @InjectPinoLogger(CreateEventHandler.name)
    private readonly logger: PinoLogger,
    @Inject(CREATE_EVENT_UNIT_OF_WORK_FACTORY)
    private readonly createEventUowFactory: IUnitOfWorkFactory<ICreateEventUnitOfWork>,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: CreateEventCommand): Promise<void> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const event = EventEntity.create({
      name: command.name,
      description: command.description,
      poster: command.poster,
      categoryId: command.categoryId,
      benefit: command.benefits,
      eligibility: command.eligibilities,
      isMultipleCategory: command.isMultipleCategory,
      organizerId: command.organizerId,
    });

    const timelines: EventTimelineEntity[] = [];
    const prerequisite: EventPrerequisiteEntity[] = [];
    const categories: EventCategoryEntity[] = command.categories.map((category) => {
      const newCategory: EventCategoryEntity = EventCategoryEntity.create({
        name: category.name,
        price: category.price,
        quota: category.participant || NaN,
        registrationStart: category.registrationStart,
        registrationEnd: category.registrationEnd,
        startDate: category.startDate,
        endDate: category.endDate,
        timelineSetting: category.timelineSetting,
        eventId: event.id,
      });

      category.timelines.forEach((timeline) => {
        timelines.push(
          EventTimelineEntity.create({
            name: timeline.name,
            description: timeline.description,
            startDate: timeline.startDate,
            endDate: timeline.endDate,
            type: timeline.type,
            input: timeline.input,
            additionalFile: timeline.additionalFile,
            eventCategoryId: newCategory.id,
          }),
        );
      });

      category.prerequisite.forEach((input) => {
        prerequisite.push(
          EventPrerequisiteEntity.create({
            name: input.name,
            description: input.description,
            type: input.type,
            answer: input.answer,
            isRequired: input.isRequired,
            index: input.index,
            eventCategoryId: newCategory.id,
          }),
        );
      });

      return newCategory;
    });

    const uow = this.createEventUowFactory.create();
    try {
      await uow.start();

      await uow.saveEvent([event]);
      await uow.saveEventCategory(categories);
      await uow.saveEventTimeline(timelines);
      await uow.saveEventPrerequisite(prerequisite);

      await uow.complete();
    } catch (error) {
      this.logger.error(error);
      await uow.cancel();
      throw error;
    }

    this.logger.trace(`END`);
  }
}
