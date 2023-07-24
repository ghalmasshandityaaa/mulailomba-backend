import { RolePermission, StringUtils } from '@mulailomba/common';
import { AuthError } from '@mulailomba/core/errors';
import { TOKEN_SERVICE } from '@mulailomba/token/constants';
import { ITokenService } from '@mulailomba/token/interfaces';
import { USER_SERVICE } from '@mulailomba/user/constants';
import { UserError } from '@mulailomba/user/errors';
import { IUserService } from '@mulailomba/user/interfaces';
import { HttpStatus, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { LoginUserCommand } from './login-user.command';
import { LoginUserResult } from './login-user.result';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand, LoginUserResult> {
  constructor(
    @InjectPinoLogger(LoginUserHandler.name)
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
  async execute(command: LoginUserCommand): Promise<LoginUserResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const user = await this.userService.findByEmail(command.emailAddress);
    if (!user) throw new UserError.NotFound();

    const valid = await StringUtils.compare(user.password, command.password);
    if (!valid) throw new AuthError.InvalidCredentials(HttpStatus.BAD_REQUEST);
    else if (!user.isActive) throw new UserError.AlreadyDeactivated();

    const tokens = await this.tokenService.generateToken({
      id: user.id,
      isActive: user.isActive,
      role: RolePermission.USER,
    });

    const result = new LoginUserResult(tokens, user);

    this.logger.trace(`END`);
    return result;
  }
}
