import { CookieUtils, RolePermission } from '@mulailomba/common';
import { USER_SERVICE } from '@mulailomba/user/constants';
import { IUserService } from '@mulailomba/user/interfaces';
import { Controller, Get, HttpCode, HttpStatus, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AUTH_SERVICE } from '../constants';
import { GoogleGuard } from '../guard';
import { IAuthService } from '../interfaces';

@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Get('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleGuard)
  async login() {
    return { method: 'Google Authentication' };
  }

  @Get('redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleGuard)
  async redirect(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.findByEmail(req.user.email);
    if (user) {
      const tokens = await this.authService.generateTokens({
        id: user.id,
        role: RolePermission.USER,
        isActive: user.isActive,
      });

      CookieUtils.set(res, 'refresh_token', tokens.refreshToken);
      return { is_registered: true, access_token: tokens.accessToken, user: null };
    } else {
      return { is_registered: false, access_token: null, user: req.user };
    }
  }
}
