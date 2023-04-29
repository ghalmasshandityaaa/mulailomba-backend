import { Cookies, CookieUtils, Identity, IIdentity, RolePermission, Roles } from '@aksesaja/common';
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
import { AUTH_SERVICE } from '../constants';
import { CheckAvailabilityEmailBodyDTO, LoginBodyDTO } from '../dtos';
import { JwtAuthGuard, RoleGuard } from '../guard';
import { IAuthService } from '../interfaces';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Post('login/user')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Res({ passthrough: true }) res: Response, @Body() body: LoginBodyDTO) {
    const identity = await this.authService.validateUser(body.emailAddress, body.password);
    const tokens = await this.authService.generateTokens(identity);

    CookieUtils.set(res, 'refresh_token', tokens.refreshToken);

    return { access_token: tokens.accessToken, refresh_token: tokens.refreshToken };
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

  @Get('me')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER, RolePermission.ORGANIZER)
  @HttpCode(HttpStatus.OK)
  async identity(@Identity() identity: IIdentity) {
    return identity;
  }
}
