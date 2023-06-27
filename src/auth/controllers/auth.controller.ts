import {
  Cookies,
  CookieUtils,
  Identity,
  IIdentity,
  RolePermission,
  Roles,
  StringUtils,
} from '@mulailomba/common';
import { ORGANIZER_SERVICE } from '@mulailomba/organizer/constants';
import { OrganizerError } from '@mulailomba/organizer/errors';
import { IOrganizerService } from '@mulailomba/organizer/interfaces';
import { USER_SERVICE } from '@mulailomba/user/constants';
import { IUserService } from '@mulailomba/user/interfaces';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
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
import { JwtAuthGuard, RoleGuard } from '../guard';
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
  ) {}

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Res({ passthrough: true }) res: Response, @Body() body: UserLoginBodyDTO) {
    CookieUtils.set(res, 'email', 'body.emailAddress');
    const identity = await this.authService.validateUser(body.emailAddress, body.password);
    console.log(1, identity);
    const tokens = await this.authService.generateTokens(identity);
    console.log(2, tokens);

    CookieUtils.set(res, 'refresh_token', tokens.refreshToken);

    return { access_token: tokens.accessToken };
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

    const organizer = await this.authService.validateOrganizer(body.id, identity.id, body.password);
    const tokens = await this.authService.generateTokens(organizer);

    CookieUtils.set(res, 'organizer_refresh_token', tokens.refreshToken);

    return { access_token: tokens.accessToken };
  }

  @Post('user/register')
  @HttpCode(HttpStatus.OK)
  async registerUser(
    @Res({ passthrough: true }) res: Response,
    @Cookies('email') emailAddress: any,
    @Body() body: UserRegisterBodyDTO,
  ) {
    if (!emailAddress) throw new AuthError.ForbiddenAccess();
    await this.userService.create({
      ...body,
      phone: body.phoneNumber,
      emailAddress,
      isActive: true,
    });
    CookieUtils.delete(res, ['email']);
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

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Cookies('refresh_token') refreshToken: any) {
    const tokens = await this.authService.refreshTokens(refreshToken);

    return { access_token: tokens.accessToken };
  }

  @Post('check-availability-email')
  @HttpCode(HttpStatus.OK)
  async checkAvailabilityEmail(
    @Res({ passthrough: true }) res: Response,
    @Body() body: CheckAvailabilityEmailBodyDTO,
  ) {
    await this.authService.checkAvailabilityEmail(body.emailAddress);
    CookieUtils.set(res, 'email', body.emailAddress);
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

  @Get('me')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER, RolePermission.ORGANIZER)
  @HttpCode(HttpStatus.OK)
  async identity(@Identity() identity: IIdentity) {
    return identity;
  }
}
