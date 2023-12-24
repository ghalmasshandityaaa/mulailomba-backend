import { TypeOrmEventEntity } from './typeorm.event.entity';
import { TypeOrmOrganizerEntity } from './typeorm.organizer.entity';

export * from './typeorm.event.entity';
export * from './typeorm.organizer.entity';

export const TypeOrmOrganizerEntities = [TypeOrmOrganizerEntity, TypeOrmEventEntity];
