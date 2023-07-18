import { FileType } from '@mulailomba/event/entities/typeorm.event.entity';
import {
  EVENT_ADDITIONAL_INPUT_TYPE,
  EVENT_TIMELINE_TYPE,
} from '@mulailomba/event/event.constants';
import { ICommand } from '@nestjs/cqrs';

class AdditionalInputProps {
  readonly name: string;
  readonly description: string;
  readonly type: EVENT_ADDITIONAL_INPUT_TYPE;
  readonly answer: string[];
  readonly isRequired: boolean;
  readonly index: number;
}

class TimelineProps {
  readonly name?: string | null;
  readonly description?: string | null;
  readonly startDate?: Date | null;
  readonly endDate?: Date | null;
  readonly type: EVENT_TIMELINE_TYPE;
  readonly input?: string | null;
  readonly additionalFile: FileType;
}

class CategoryProps {
  readonly name?: string | null;
  readonly price: number;
  readonly participant: number | null;
  readonly registrationStart: Date;
  readonly registrationEnd: Date;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly timelineSetting: boolean;
  readonly additionalInputs: AdditionalInputProps[];
  readonly timelines: TimelineProps[];
}

class Props {
  readonly organizerId: string;
  readonly name: string;
  readonly poster: FileType;
  readonly categoryId: string;
  readonly benefits: string[];
  readonly eligibilities: string[];
  readonly description: string | null;
  readonly isMultipleCategory: boolean;
  readonly categories: CategoryProps[];
}

export class CreateEventCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
