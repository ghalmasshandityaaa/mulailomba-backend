import { Constraint } from '../interfaces';
import { RepositoryError } from './repository.error';

export class DatabaseConstraintError extends RepositoryError {
  public readonly constraint: Constraint;

  constructor(repositoryName: string, constraint: Constraint, message?: string, cause?: Error) {
    super(repositoryName, message, cause);
    this.constraint = constraint;
  }
}
