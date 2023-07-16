import {
  EVENT_ADDITIONAL_INPUT_TYPE,
  EVENT_TIMELINE_TYPE,
} from '@mulailomba/event/event.constants';
import { ICommand } from '@nestjs/cqrs';

class PosterProps {
  readonly publicId: string;
  readonly secureUrl: string;
}

class AdditionalInputProps {
  readonly name: string;
  readonly description: string;
  readonly type: EVENT_ADDITIONAL_INPUT_TYPE;
  readonly answer: string[];
  readonly isRequired: boolean;
  readonly index: number;
}

class TimelineProps {
  readonly name: string;
  readonly description: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly type: EVENT_TIMELINE_TYPE;
  readonly input: string;
}

class CategoryProps {
  readonly name: string;
  readonly price: number;
  readonly participant: number | null;
  readonly registrationStart: Date;
  readonly registrationEnd: Date;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly additionalInputs: AdditionalInputProps[];
  readonly timelines: TimelineProps[];
}

class Props {
  readonly userId: string;
  readonly name: string;
  readonly poster: PosterProps;
  readonly categoryId: string;
  readonly benefits: string[];
  readonly eligibilities: string[];
  readonly description: string | null;
  readonly categories: CategoryProps[];
}

export class CreateEventCommand extends Props implements ICommand {
  constructor(props: Props) {
    super();
    Object.assign(this, props);
  }
}
