import { RolePermission } from '@mulailomba/common';
import { TOKEN_SERVICE } from '@mulailomba/token/constants';
import { ITokenService } from '@mulailomba/token/interfaces';
import { USER_SERVICE } from '@mulailomba/user/constants';
import { IUserService } from '@mulailomba/user/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RegisterUserCommand } from './register-user.command';
import { RegisterUserResult } from './register-user.result';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand, RegisterUserResult>
{
  constructor(
    @InjectPinoLogger(RegisterUserHandler.name)
    private readonly logger: PinoLogger,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const entity = await this.userService.create({
      ...command,
      isActive: true,
    });

    entity.commit();

    const tokens = await this.tokenService.generateToken({
      id: entity.id,
      isActive: entity.props.isActive,
      role: RolePermission.USER,
    });

    const result = new RegisterUserResult(tokens);

    this.logger.trace(`END`);
    return result;
  }
}
