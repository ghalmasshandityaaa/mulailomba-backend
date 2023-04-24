import { Constraint, IRepository } from '@aksesaja/common';
import { DatabaseError } from 'pg';
import { QueryFailedError } from 'typeorm';
import { DatabaseConstraintError } from './database-constraint.error';
import { PostgresQueryErrorMessages } from './query-error.messages';

type TypeOrmDriver = 'postgres';

/**
 *
 */
export abstract class TypeOrmBaseRepository implements IRepository {
  abstract readonly name: string;
  abstract readonly driver: TypeOrmDriver;

  /**
   *
   * @param err
   */
  protected handleError(err: Error): never {
    if (err instanceof QueryFailedError) {
      // TODO add more driver support if needed

      if (this.driver === 'postgres') {
        const driverError = err.driverError as DatabaseError;

        let constraint: Constraint | undefined;
        if (driverError.constraint) {
          if (err.message.includes(PostgresQueryErrorMessages.FOREIGN_KEY_CONSTRAINT_ERROR)) {
            constraint = {
              name: driverError.constraint,
              isForeign: true,
              isUnique: false,
            };
          }

          if (err.message.includes(PostgresQueryErrorMessages.UNIQUE_CONSTRAINT_ERROR)) {
            constraint = {
              name: driverError.constraint,
              isUnique: true,
              isForeign: false,
            };
          }

          if (constraint)
            throw new DatabaseConstraintError(this.name, constraint, err.message, err);
        }
      }
    }

    // fallback to original error
    throw err;
  }

  /**
   *
   * @param fn
   * @returns
   */
  protected async execute<T>(fn: () => Promise<T>) {
    return fn()
      .then()
      .catch((err) => this.handleError(err));
  }
}
