import { IIdentity, RolePermission } from '@mulailomba/common';
import { AuthError } from '@mulailomba/core/errors';
import { ORGANIZER_SERVICE } from '@mulailomba/organizer/constants';
import { IOrganizerService } from '@mulailomba/organizer/interfaces';
import { TOKEN_SERVICE } from '@mulailomba/token/constants';
import { ITokenService } from '@mulailomba/token/interfaces';
import { USER_SERVICE } from '@mulailomba/user/constants';
import { IUserService } from '@mulailomba/user/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RefreshTokenCommand } from './refresh-token.command';
import { RefreshTokenResult } from './refresh-token.result';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand, RefreshTokenResult>
{
  constructor(
    @InjectPinoLogger(RefreshTokenHandler.name)
    private readonly logger: PinoLogger,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(ORGANIZER_SERVICE)
    private readonly organizerService: IOrganizerService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const identity = this.tokenService.validate(command.token);
    const valid = await this.validate(identity);
    if (!valid) throw new AuthError.InvalidCredentials();

    const accessToken = this.tokenService.generateAccessToken(identity);
    const result = new RefreshTokenResult(accessToken);

    this.logger.trace(`END`);
    return result;
  }

  private async validate(identity: IIdentity): Promise<boolean> {
    let valid = false;

    if (identity.role === RolePermission.USER) {
      const user = await this.userService.findById(identity.id);
      if (user) valid = true;
    } else if (identity.role === RolePermission.ORGANIZER) {
      const organizer = await this.organizerService.findById(identity.id);
      if (organizer) valid = true;
    }

    return valid;
  }
}
