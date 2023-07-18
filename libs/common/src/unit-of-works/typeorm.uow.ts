import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { IUnitOfWork } from '../interfaces';

/**
 *
 */
export abstract class TypeOrmUnitOfWork implements IUnitOfWork {
  constructor(private connection: DataSource, private readonly isolationLevel?: IsolationLevel) {}

  private queryRunner: QueryRunner;
  private manager: EntityManager;

  private _started: boolean;

  /**
   *
   */
  async start(): Promise<void> {
    this.queryRunner = this.connection.createQueryRunner();

    await this.queryRunner.connect();
    await this.queryRunner.startTransaction(this.isolationLevel);

    this.manager = this.queryRunner.manager;
    this._started = true;
  }

  /**
   *
   * @param entity
   * @returns
   */
  protected getRepository<TEntity extends ObjectLiteral>(
    entity: EntityTarget<any>,
  ): Repository<TEntity> {
    return this.manager.getRepository(entity);
  }

  /**
   *
   */
  async cancel(): Promise<void> {
    if (this._started) {
      await this.queryRunner.rollbackTransaction();
      await this.queryRunner.release();
      this._started = false;
    }
  }

  /**
   *
   */
  async complete(): Promise<void> {
    if (!this._started)
      throw new Error('unit of work is not yet started. Did you forgot to call start() ?');

    try {
      await this.queryRunner.commitTransaction();
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
      this._started = false;
    }
  }
}
