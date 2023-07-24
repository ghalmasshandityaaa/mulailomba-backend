import { RolePermission, StringUtils } from '@mulailomba/common';
import { AuthError } from '@mulailomba/core/errors';
import { ORGANIZER_SERVICE, ORGANIZER_WRITE_REPOSITORY } from '@mulailomba/organizer/constants';
import { OrganizerError } from '@mulailomba/organizer/errors';
import { IOrganizerService, IOrganizerWriteRepository } from '@mulailomba/organizer/interfaces';
import { TOKEN_SERVICE } from '@mulailomba/token/constants';
import { ITokenService } from '@mulailomba/token/interfaces';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { SwitchAccountCommand } from './switch-account.command';
import { SwitchAccountResult } from './switch-account.result';

@CommandHandler(SwitchAccountCommand)
export class SwitchAccountHandler
  implements ICommandHandler<SwitchAccountCommand, SwitchAccountResult>
{
  constructor(
    @InjectPinoLogger(SwitchAccountHandler.name)
    private readonly logger: PinoLogger,
    @Inject(ORGANIZER_WRITE_REPOSITORY)
    private readonly repository: IOrganizerWriteRepository,
    @Inject(ORGANIZER_SERVICE)
    private readonly service: IOrganizerService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: SwitchAccountCommand): Promise<SwitchAccountResult> {
    this.logger.trace(`BEGIN`);
    this.logger.info({ command });

    const [newOrganizer, currentOrganizer] = await Promise.all([
      this.repository.findById(command.id),
      this.repository.findById(command.organizerId),
    ]);

    if (!newOrganizer || !currentOrganizer) {
      throw new OrganizerError.NotFound();
    } else if (!newOrganizer.props.isActive) {
      throw new OrganizerError.AlreadyDeactivated();
    } else if (newOrganizer.props.userId !== currentOrganizer.props.userId) {
      throw new AuthError.ForbiddenAccess();
    } else if (newOrganizer.id === currentOrganizer.id) {
      throw new OrganizerError.SignedIn();
    } else if (newOrganizer.props.isLocked) {
      if (
        !command.password ||
        !StringUtils.compare(newOrganizer.props.password, command.password)
      ) {
        throw new OrganizerError.InvalidPassword();
      }
    }

    const token = await this.tokenService.generateToken({
      id: newOrganizer.id,
      isActive: newOrganizer.props.isActive,
      role: RolePermission.ORGANIZER,
    });

    const result = new SwitchAccountResult(token.accessToken, token.refreshToken, {
      id: newOrganizer.id,
      ...newOrganizer.props,
    });

    this.logger.trace(`END`);
    return result;
  }
}
