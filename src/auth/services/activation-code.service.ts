import { GenerateRandomCode } from '@aksesaja/common';
import { DatabaseConstraintError, TypeOrmBaseRepository } from '@aksesaja/common/repositories';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { DataSource } from 'typeorm';
import { TypeOrmActivationCodeEntity } from '../entities';
import { AuthError, VerificationError } from '../errors';
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

  async verifyActivationCode(emailAddress: string, activationCode: string): Promise<void> {
    if (!emailAddress) throw new AuthError.InvalidCredentials();
    const verification = await this.findByEmail(emailAddress);

    if (!verification) throw new AuthError.EmailNotRegistered();
    if (activationCode !== verification.activationCode) throw new VerificationError.InvalidCode();

    await this.delete(emailAddress);
  }

  private async findByEmail(
    emailAddress: string,
  ): Promise<TypeOrmActivationCodeEntity | undefined> {
    const entity = await this.dataSource
      .createQueryBuilder(TypeOrmActivationCodeEntity, 'ac')
      .where('ac.emailAddress = :emailAddress', { emailAddress })
      .getOne();

    return entity || undefined;
  }

  private async delete(emailAddress: string): Promise<void> {
    return this.execute(async () => {
      await this.dataSource
        .createEntityManager()
        .delete(TypeOrmActivationCodeEntity, { emailAddress });
    });
  }
}
