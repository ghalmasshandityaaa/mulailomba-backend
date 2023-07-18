import { TypeOrmEventAdditionalInputEntity } from './typeorm.event-additional-input.entity';
import { TypeOrmEventBenefitEntity } from './typeorm.event-benefit.entity';
import { TypeOrmEventCategoryEntity } from './typeorm.event-cetegory.entity';
import { TypeOrmEventEligibilityEntity } from './typeorm.event-eligibility.entity';
import { TypeOrmEventTimelineEntity } from './typeorm.event-timeline.entity';
import { TypeOrmEventEntity } from './typeorm.event.entity';

export const TypeOrmEventEntities = [
  TypeOrmEventEntity,
  TypeOrmEventTimelineEntity,
  TypeOrmEventAdditionalInputEntity,
  TypeOrmEventBenefitEntity,
  TypeOrmEventCategoryEntity,
  TypeOrmEventEligibilityEntity,
];
