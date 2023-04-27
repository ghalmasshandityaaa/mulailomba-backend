import { Cookies, CookieUtils, Identity, IIdentity, RolePermission, Roles } from '@aksesaja/common';
import { Body, Controller, Get, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AUTH_SERVICE } from '../constants';
import { LoginBodyDTO } from '../dtos';
import { JwtAuthGuard, RoleGuard } from '../guard';
import { AuthService } from '../services';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {}

  @Post('login/user')
  async loginUser(@Res({ passthrough: true }) res: Response, @Body() body: LoginBodyDTO) {
    const identity = await this.authService.validateUser(body.emailAddress, body.password);
    const tokens = await this.authService.generateTokens(identity);

    CookieUtils.set(res, 'refresh_token', tokens.refreshToken);

    return { access_token: tokens.accessToken, refresh_token: tokens.refreshToken };
  }

  @Post('refresh')
  async refreshTokens(@Cookies('refresh_token') refreshToken: any) {
    const tokens = await this.authService.refreshTokens(refreshToken);

    return { access_token: tokens.accessToken };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER, RolePermission.ORGANIZER)
  async identity(@Identity() identity: IIdentity) {
    return identity;
  }
}
