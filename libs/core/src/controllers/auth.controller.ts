import {
  Cookies,
  CookieUtils,
  Identity,
  IIdentity,
  RolePermission,
  Roles,
  StringUtils,
} from '@mulailomba/common';
import { JwtAuthGuard, RoleGuard } from '@mulailomba/common/guards';
import { ORGANIZER_SERVICE } from '@mulailomba/organizer/constants';
import { OrganizerError } from '@mulailomba/organizer/errors';
import { IOrganizerService } from '@mulailomba/organizer/interfaces';
import { TOKEN_SERVICE } from '@mulailomba/token/constants';
import { ITokenService } from '@mulailomba/token/interfaces';
import { USER_SERVICE } from '@mulailomba/user/constants';
import { IUserService } from '@mulailomba/user/interfaces';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { LoginOrganizerCommand, LoginUserCommand } from '../commands';
import { CheckAvailabilityEmailCommand } from '../commands/check-availability-email/check-availability-email.command';
import { ACTIVATION_CODE_SERVICE, AUTH_SERVICE } from '../constants';
import {
  CheckAvailabilityEmailBodyDTO,
  OrganizerLoginBodyDTO,
  OrganizerRegisterBodyDTO,
  UserLoginBodyDTO,
  UserRegisterBodyDTO,
  VerifyAccountBodyDTO,
} from '../dtos';
import { AuthError } from '../errors';
import { IActivationCodeService, IAuthService } from '../interfaces';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
    @Inject(ACTIVATION_CODE_SERVICE)
    private readonly acService: IActivationCodeService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(ORGANIZER_SERVICE)
    private readonly organizerService: IOrganizerService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Res({ passthrough: true }) res: Response, @Body() body: UserLoginBodyDTO) {
    const command = new LoginUserCommand({ ...body });
    const token = await this.commandBus.execute(command);

    CookieUtils.set(res, 'refresh_token', token.refreshToken);

    return token;
  }

  @Post('organizer/login')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER)
  @HttpCode(HttpStatus.OK)
  async loginOrganizer(
    @Res({ passthrough: true }) res: Response,
    @Body() body: OrganizerLoginBodyDTO,
    @Identity() identity: IIdentity,
    @Cookies('organizer_refresh_token') organizerRefreshToken: any,
  ) {
    if (organizerRefreshToken) throw new AuthError.SignedIn();

    const command = new LoginOrganizerCommand({ ...body, userId: identity.id });
    const token = await this.commandBus.execute(command);

    CookieUtils.set(res, 'organizer_refresh_token', token.refreshToken);

    return token;
  }

  @Post('user/register')
  @HttpCode(HttpStatus.OK)
  async registerUser(
    @Res({ passthrough: true }) res: Response,
    @Cookies('email') emailAddress: any,
    @Body() body: UserRegisterBodyDTO,
  ) {
    if (!emailAddress) throw new AuthError.ForbiddenAccess();
    const entity = await this.userService.create({
      ...body,
      phone: body.phoneNumber,
      emailAddress,
      isActive: true,
    });
    const tokens = await this.tokenService.generateToken({
      id: entity.id,
      isActive: entity.props.isActive,
      role: RolePermission.USER,
    });
    CookieUtils.delete(res, ['email']);
    CookieUtils.set(res, 'refresh_token', tokens.refreshToken);

    return { access_token: tokens.accessToken };
  }

  @Post('organizer/register')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER)
  async registerOrganizer(@Body() body: OrganizerRegisterBodyDTO, @Identity() identity: IIdentity) {
    const organizer = await this.organizerService.findByEmail(body.emailAddress);
    if (organizer) throw new OrganizerError.EmailTaken();
    await this.organizerService.create({ ...body, userId: identity.id });
  }

  @Post('user/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER)
  async logoutUser(@Res({ passthrough: true }) res: Response) {
    CookieUtils.delete(res, ['refresh_token']);
  }

  @Post('organizer/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async logoutOrganizer(
    @Res({ passthrough: true }) res: Response,
    @Identity() identity: IIdentity,
  ) {
    const organizer = await this.organizerService.findAggregateById(identity.id);
    if (!organizer) throw new OrganizerError.NotFound();

    organizer.logout();
    organizer.commit();

    CookieUtils.delete(res, ['organizer_refresh_token']);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Cookies('refresh_token') refreshToken: any,
    @Cookies('organizer_refresh_token') organizerRefreshToken: any,
    @Headers('X-Resource-Type') type: string,
  ) {
    const token = type?.toUpperCase() === 'ORGANIZER' ? organizerRefreshToken : refreshToken;
    if (!token) throw new AuthError.ForbiddenAccess();

    const accessToken = await this.authService.refreshTokens(token);

    return { access_token: accessToken };
  }

  @Post('check-availability-email')
  @HttpCode(HttpStatus.OK)
  async checkAvailabilityEmail(
    @Res({ passthrough: true }) res: Response,
    @Body() body: CheckAvailabilityEmailBodyDTO,
  ) {
    const command = new CheckAvailabilityEmailCommand({ ...body });
    await this.commandBus.execute(command);
    CookieUtils.set(res, 'email', body.emailAddress);
    return;
  }

  @Post('user/verify')
  @HttpCode(HttpStatus.OK)
  async verifyActivationCode(@Body() body: VerifyAccountBodyDTO) {
    const [email, code] = StringUtils.decrypt(body.id).split(':');
    await this.acService.verify(email, code);
  }

  @Post('resend-activation-code')
  @HttpCode(HttpStatus.OK)
  async resendActivationCode(@Cookies('email') email: any) {
    if (!email) throw new AuthError.ForbiddenAccess();
    await this.authService.sendActivationCode(email as string);
  }
}
