import {
  EVENT_PREREQUISITE_TYPE_ENUM,
  EVENT_TIMELINE_TYPE_ENUM,
} from '@mulailomba/event/event.constants';
import { ICommand } from '@nestjs/cqrs';

class PrerequisiteProps {
  readonly name: string;
  readonly description: string;
  readonly type: EVENT_PREREQUISITE_TYPE_ENUM;
  readonly answer: string[];
  readonly isRequired: boolean;
  readonly index: number;
}

class TimelineProps {
  readonly name?: string | null;
  readonly description?: string | null;
  readonly startDate?: Date | null;
  readonly endDate?: Date | null;
  readonly type: EVENT_TIMELINE_TYPE_ENUM;
  readonly input?: string | null;
  readonly additionalFile: string;
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
  readonly prerequisite: PrerequisiteProps[];
  readonly timelines: TimelineProps[];
}

class Props {
  readonly organizerId: string;
  readonly name: string;
  readonly poster: string;
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
