import { RolePermission, StringUtils } from '@mulailomba/common';
import { AuthError } from '@mulailomba/core/errors';
import { ORGANIZER_SERVICE } from '@mulailomba/organizer/constants';
import { OrganizerError } from '@mulailomba/organizer/errors';
import { IOrganizerService } from '@mulailomba/organizer/interfaces';
import { TOKEN_SERVICE } from '@mulailomba/token/constants';
import { ITokenService } from '@mulailomba/token/interfaces';
import { HttpStatus, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { LoginOrganizerCommand } from './login-organizer.command';
import { LoginOrganizerResult } from './login-organizer.result';

@CommandHandler(LoginOrganizerCommand)
export class LoginOrganizerHandler
  implements ICommandHandler<LoginOrganizerCommand, LoginOrganizerResult>
{
  constructor(
    @InjectPinoLogger(LoginOrganizerHandler.name)
    private readonly logger: PinoLogger,
    @Inject(ORGANIZER_SERVICE)
    private readonly organizerService: IOrganizerService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: LoginOrganizerCommand): Promise<LoginOrganizerResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const organizer = await this.organizerService.findById(command.id, command.userId);
    if (!organizer) throw new OrganizerError.NotFound();

    if (organizer.isLocked) {
      if (!command.password) throw new AuthError.InvalidCredentials(HttpStatus.BAD_REQUEST);

      const valid = await StringUtils.compare(organizer.password, command.password);
      if (!valid) throw new AuthError.InvalidCredentials(HttpStatus.BAD_REQUEST);
    }

    if (!organizer.isActive) throw new OrganizerError.AlreadyDeactivated();

    const tokens = await this.tokenService.generateToken({
      id: organizer.id,
      isActive: organizer.isActive,
      role: RolePermission.ORGANIZER,
    });

    const result = new LoginOrganizerResult(tokens, organizer);

    this.logger.trace(`END`);
    return result;
  }
}
