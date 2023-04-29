import { GenerateRandomCode } from '@aksesaja/common';
import { DatabaseConstraintError, TypeOrmBaseRepository } from '@aksesaja/common/repositories';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { DataSource } from 'typeorm';
import { TypeOrmActivationCodeEntity } from '../entities';
import { IActivationCodeService } from '../interfaces';

export class ActivationCodeService extends TypeOrmBaseRepository implements IActivationCodeService {
  readonly name: string = 'TypeOrmProductNotExistsWriteRepository';
  readonly driver = 'postgres';

  constructor(
    @InjectPinoLogger(ActivationCodeService.name)
    private readonly logger: PinoLogger,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {
    super();
  }

  async create(emailAddress: string, activationCode: string): Promise<void> {
    const method = 'create';
    this.logger.trace({ method }, 'BEGIN');

    const createdAt = new Date();
    try {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(TypeOrmActivationCodeEntity)
        .values({
          emailAddress,
          activationCode,
          createdAt,
          expiredAt: new Date(createdAt.getTime() + 15 * 60000),
        })
        .orUpdate(['activation_code'], ['email_address'])
        .execute();
    } catch (err) {
      if (err instanceof DatabaseConstraintError && err.constraint.isUnique) {
        this.create(emailAddress, GenerateRandomCode(6));
      }
      this.handleError(err);
    }

    this.logger.trace({ method }, 'END');
  }
}
