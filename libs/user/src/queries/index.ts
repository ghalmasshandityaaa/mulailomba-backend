import { FindUserByIdHandler } from './find-user-by-id/find-user-by-id.handler';
import { FindUserByIdQuery } from './find-user-by-id/find-user-by-id.query';

export { FindUserByIdQuery };

export const QueryHandlers = [FindUserByIdHandler];
