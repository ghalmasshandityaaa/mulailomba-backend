export interface IUnitOfWork {
  /**
   *
   */
  start(): Promise<void> | void;

  /**
   *
   */
  cancel(): Promise<void> | void;

  /**
   *
   */
  complete(): Promise<void> | void;
}
