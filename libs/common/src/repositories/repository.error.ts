export class RepositoryError extends Error {
  public readonly cause?: Error;
  public readonly repositoryName: string;

  constructor(repositoryName: string, message?: string, cause?: Error) {
    super(message);
    this.repositoryName = repositoryName;
    this.cause = cause;
  }
}
