import JoiDate from '@joi/date';
import { Expose, Type } from 'class-transformer';
import { subDays } from 'date-fns';
import * as JoiImport from 'joi';
import { getClassSchema, JoiSchema } from 'joi-class-decorators';
import { values } from 'lodash';
import { DateTime } from 'luxon';
import { EVENT_ADDITIONAL_INPUT_TYPE, EVENT_TIMELINE_TYPE } from '../event.constants';

const joi: JoiImport.Root = JoiImport.extend(JoiDate);

class FileDto {
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
        then: joi.array().min(1).required(),
        otherwise: joi.optional(),
      })
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
  @JoiSchema(
    joi
      .string()
      .trim()
      .when('timelineSetting', {
        is: true,
        then: joi.required(),
        otherwise: joi.optional().allow(null),
      })
      .label('name'),
  )
  readonly name: string | null;

  @JoiSchema(
    joi
      .string()
      .trim()
      .when('timelineSetting', {
        is: true,
        then: joi.required(),
        otherwise: joi.optional().allow(null),
      })
      .label('description'),
  )
  readonly description: string | null;

  @JoiSchema(
    joi
      .date()
      .format('YYYY-MM-DD')
      .when('timelineSetting', {
        is: true,
        then: joi.required(),
        otherwise: joi.optional().allow(null),
      })
      .label('start_date'),
  )
  @Expose({ name: 'start_date' })
  readonly startDate: Date | null;

  @JoiSchema(
    joi
      .date()
      .format('YYYY-MM-DD')
      .greater(joi.ref('startDate'))
      .when('timelineSetting', {
        is: true,
        then: joi.required(),
        otherwise: joi.optional().allow(null),
      })
      .label('end_date'),
  )
  @Expose({ name: 'end_date' })
  readonly endDate: Date | null;

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
      .string()
      .when('type', {
        switch: [{ is: EVENT_TIMELINE_TYPE.ONLINE, then: joi.string().uri().required() }],
        otherwise: joi.string().allow(null).optional(),
      })
      .required()
      .label('input'),
  )
  readonly input: string | null;

  @JoiSchema(
    joi
      .when('type', {
        is: EVENT_TIMELINE_TYPE.INFORMATION,
        then: getClassSchema(FileDto),
        otherwise: joi.valid(null),
      })
      .label('additional_file'),
  )
  @Expose({ name: 'additional_file' })
  @Type(() => FileDto)
  readonly additionalFile: FileDto;
}

class EventCategoryDTO {
  @JoiSchema(
    joi
      .string()
      .trim()
      .when('isMultipleCategory', {
        is: true,
        then: joi.required(),
        otherwise: joi.optional().allow(null),
      })
      .label('name'),
  )
  readonly name: string | null;

  @JoiSchema(joi.number().min(0).required().label('price'))
  readonly price: number;

  @JoiSchema(joi.number().positive().allow(null).required().label('participant'))
  readonly participant: number | null;

  @JoiSchema(
    joi
      .date()
      .format('YYYY-MM-DD')
      .greater(DateTime.fromJSDate(subDays(new Date(), 1)).toFormat('yyyy-LL-dd'))
      .required()
      .label('registration_start'),
  )
  @Expose({ name: 'registration_start' })
  readonly registrationStart: Date;

  @JoiSchema(
    joi
      .date()
      .format('YYYY-MM-DD')
      .greater(joi.ref('registrationStart'))
      .required()
      .label('registration_end'),
  )
  @Expose({ name: 'registration_end' })
  readonly registrationEnd: Date;

  @JoiSchema(
    joi
      .date()
      .format('YYYY-MM-DD')
      .greater(joi.ref('registrationEnd'))
      .required()
      .label('start_date'),
  )
  @Expose({ name: 'start_date' })
  readonly startDate: Date;

  @JoiSchema(
    joi.date().format('YYYY-MM-DD').greater(joi.ref('startDate')).required().label('end_date'),
  )
  @Expose({ name: 'end_date' })
  readonly endDate: Date;

  @JoiSchema(joi.boolean().required().label('timeline_setting'))
  @Expose({ name: 'timeline_setting' })
  readonly timelineSetting: boolean;

  @JoiSchema(
    joi
      .array()
      .items(getClassSchema(EventAdditionalInputDTO))
      .optional()
      .label('additional_inputs'),
  )
  @Expose({ name: 'additional_inputs' })
  @Type(() => EventAdditionalInputDTO)
  readonly additionalInputs: EventAdditionalInputDTO[];

  // step 4
  @JoiSchema(
    joi.array().items(getClassSchema(EventTimelineDTO)).optional().label('event_timelines'),
  )
  @Expose({ name: 'event_timelines' })
  @Type(() => EventTimelineDTO)
  readonly eventTimelines: EventTimelineDTO[];
}

export class CreateEventBodyDTO {
  // step 1
  @JoiSchema(joi.string().trim().required().label('name'))
  readonly name: string;

  @JoiSchema(joi.string().uuid().required().label('category_id'))
  @Expose({ name: 'category_id' })
  readonly categoryId: string;

  @JoiSchema(getClassSchema(FileDto).required().label('poster'))
  @Type(() => FileDto)
  readonly poster: FileDto;

  @JoiSchema(joi.array().items(joi.string().uuid()).min(1).unique().required().label('benefits'))
  readonly benefits: string[];

  @JoiSchema(
    joi.array().items(joi.string().uuid()).min(1).unique().required().label('eligibilities'),
  )
  readonly eligibilities: string[];

  // step 2
  @JoiSchema(
    joi.array().items(getClassSchema(EventCategoryDTO)).min(1).required().label('event_categories'),
  )
  @Expose({ name: 'event_categories' })
  @Type(() => EventCategoryDTO)
  readonly eventCategories: EventCategoryDTO[];

  // step 3
  @JoiSchema(joi.string().required().allow('').allow(null).label('description'))
  readonly description: string | null;

  @JoiSchema(joi.boolean().required().label('is_multiple_category'))
  @Expose({ name: 'is_multiple_category' })
  readonly isMultipleCategory: boolean;
}
