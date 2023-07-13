import { CookieUtils, RolePermission } from '@mulailomba/common';
import { TOKEN_SERVICE } from '@mulailomba/token/constants';
import { ITokenService } from '@mulailomba/token/interfaces';
import { USER_SERVICE } from '@mulailomba/user/constants';
import { IUserService } from '@mulailomba/user/interfaces';
import { Controller, Get, HttpCode, HttpStatus, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { FacebookGuard } from '../guard/facebook.guard';

@Controller({
  path: 'auth/facebook',
  version: '1',
})
export class AuthFacebookController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  @Get('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FacebookGuard)
  async login() {
    return { method: 'Facebook Authentication' };
  }

  @Get('redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FacebookGuard)
  async redirect(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.findByEmail(req.user.email);
    if (user) {
      const tokens = await this.tokenService.generateToken({
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
