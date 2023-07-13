import { Expose } from 'class-transformer';
import * as joi from 'joi';
import { getClassSchema, JoiSchema } from 'joi-class-decorators';
import { values } from 'lodash';
import { EventPosterType } from '../entities/typeorm.event.entity';
import { EVENT_ADDITIONAL_INPUT_TYPE, EVENT_TIMELINE_TYPE } from '../event.constants';

class PosterDTO {
  @JoiSchema(joi.string().required().label('public_id'))
  @Expose({ name: 'public_id' })
  readonly publicId: string;

  @JoiSchema(joi.string().uri().required().label('secure_url'))
  @Expose({ name: 'secure_url' })
  readonly secureUrl: string;
}

class EventAdditionalInputDTO {
  @JoiSchema(joi.string().trim().required().label('name'))
  readonly name: string;

  @JoiSchema(joi.string().trim().required().label('description'))
  readonly description: string;

  @JoiSchema(
    joi
      .string()
      .trim()
      .valid(...values(EVENT_ADDITIONAL_INPUT_TYPE))
      .required()
      .label('type'),
  )
  readonly type: EVENT_ADDITIONAL_INPUT_TYPE;

  @JoiSchema(
    joi
      .array()
      .items(joi.string())
      .when('type', {
        is: joi.valid(
          EVENT_ADDITIONAL_INPUT_TYPE.MULTIPLE_CHOICE,
          EVENT_ADDITIONAL_INPUT_TYPE.CHECKBOX,
        ),
        then: joi.required(),
        otherwise: joi.optional(),
      })
      .min(1)
      .label('answer'),
  )
  readonly answer: string[];

  @JoiSchema(joi.boolean().required().label('is_required'))
  @Expose({ name: 'is_required' })
  readonly isRequired: boolean;

  @JoiSchema(joi.number().min(0).required().label('index'))
  readonly index: number;
}

class EventTimelineDTO {
  @JoiSchema(joi.string().trim().required().label('name'))
  readonly name: string;

  @JoiSchema(joi.string().trim().required().label('description'))
  readonly description: string;

  @JoiSchema(joi.date().required().label('start_date'))
  @Expose({ name: 'start_date' })
  readonly startDate: Date;

  @JoiSchema(joi.date().greater(joi.ref('start_date')).required().label('start_date'))
  @Expose({ name: 'end_date' })
  readonly endDate: Date;

  @JoiSchema(
    joi
      .string()
      .trim()
      .valid(...values(EVENT_TIMELINE_TYPE))
      .required()
      .label('type'),
  )
  readonly type: EVENT_TIMELINE_TYPE;

  @JoiSchema(
    joi
      .when('type', {
        is: joi.valid(EVENT_TIMELINE_TYPE.ONLINE),
        then: joi.string().uri().required(),
      })
      .when('type', {
        is: EVENT_TIMELINE_TYPE.OFFLINE,
        then: joi.string().required(),
        otherwise: joi.optional(),
      })
      .label('input'),
  )
  readonly input: string;

  @JoiSchema(joi.number().min(0).required().label('index'))
  readonly index: number;
}

class EventCategoryDTO {
  @JoiSchema(joi.string().trim().required().label('name'))
  readonly name: string;

  @JoiSchema(joi.number().min(0).required().label('price'))
  readonly price: number;

  @JoiSchema(joi.number().positive().allow(NaN).required().label('price'))
  readonly participant: number;

  @JoiSchema(joi.date().required().label('registration_start'))
  @Expose({ name: 'registration_start' })
  readonly registrationStart: Date;

  @JoiSchema(joi.date().greater(joi.ref('registration_start')).required().label('registration_end'))
  @Expose({ name: 'registration_end' })
  readonly registrationEnd: Date;

  @JoiSchema(joi.date().greater(joi.ref('registration_end')).required().label('start_date'))
  @Expose({ name: 'start_date' })
  readonly startDate: Date;

  @JoiSchema(joi.date().greater(joi.ref('start_date')).required().label('end_date'))
  @Expose({ name: 'end_date' })
  readonly endDate: Date;

  @JoiSchema(joi.number().min(0).required().label('index'))
  readonly index: number;

  @JoiSchema(
    joi
      .array()
      .items(getClassSchema(EventAdditionalInputDTO))
      .min(1)
      .optional()
      .label('additional_inputs'),
  )
  readonly additionalInputs: EventAdditionalInputDTO[];

  // step 4
  @JoiSchema(
    joi.array().items(getClassSchema(EventTimelineDTO)).min(1).optional().label('event_timelines'),
  )
  readonly eventTimelines: EventTimelineDTO[];
}

export class CreateEventBodyDTO {
  // step 1
  @JoiSchema(joi.string().trim().required().label('name'))
  readonly name: string;

  @JoiSchema(joi.string().required().label('category_id'))
  readonly categoryId: string;

  @JoiSchema(joi.object(getClassSchema(PosterDTO)).required().label('poster'))
  readonly poster: EventPosterType;

  @JoiSchema(joi.array().items(joi.string().uuid()).required().label('benefits'))
  readonly benefits: string[];

  @JoiSchema(joi.array().items(joi.string().uuid()).required().label('eligibilities'))
  readonly eligibilities: string[];

  // step 2
  @JoiSchema(
    joi.array().items(getClassSchema(EventCategoryDTO)).min(1).required().label('event_categories'),
  )
  readonly eventCategories: EventCategoryDTO[];

  // step 3
  @JoiSchema(joi.string().required().label('description'))
  readonly description: string;
}
