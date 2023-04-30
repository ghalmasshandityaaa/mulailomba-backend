import { Cookies, CookieUtils, Identity, IIdentity, RolePermission, Roles } from '@aksesaja/common';
import { USER_SERVICE } from '@aksesaja/user/constants';
import { IUserService } from '@aksesaja/user/interfaces';
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
  UserLoginBodyDTO,
  UserRegisterBodyDTO,
  VerifyActivationCodeBodyDTO,
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
  ) {}

  @Post('login/user')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Res({ passthrough: true }) res: Response, @Body() body: UserLoginBodyDTO) {
    const identity = await this.authService.validateUser(body.emailAddress, body.password);
    const tokens = await this.authService.generateTokens(identity);

    CookieUtils.set(res, 'refresh_token', tokens.refreshToken);

    return { access_token: tokens.accessToken, refresh_token: tokens.refreshToken };
  }

  @Post('register/user')
  @HttpCode(HttpStatus.OK)
  async registerUser(
    @Res({ passthrough: true }) res: Response,
    @Cookies('email') emailAddress: any,
    @Cookies('is_valid') isValid: any,
    @Body() body: UserRegisterBodyDTO,
  ) {
    if (!emailAddress || !isValid) throw new AuthError.ForbiddenAccess();
    await this.userService.create({
      ...body,
      phone: body.phoneNumber,
      emailAddress,
      isActive: true,
    });
    CookieUtils.delete(res, ['email', 'is_valid']);
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

  @Post('verify-activation-code')
  @HttpCode(HttpStatus.OK)
  async verifyActivationCode(
    @Res({ passthrough: true }) res: Response,
    @Body() body: VerifyActivationCodeBodyDTO,
    @Cookies('email') email: any,
  ) {
    await this.acService.verifyActivationCode(email as string, body.activationCode);
    CookieUtils.set(res, 'is_valid', 'true');
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
