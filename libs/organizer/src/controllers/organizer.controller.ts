import {
  Cookies,
  CookieUtils,
  Identity,
  IIdentity,
  RolePermission,
  Roles,
} from '@mulailomba/common';
import { JwtAuthGuard, RoleGuard } from '@mulailomba/common/guards';
import { AuthError } from '@mulailomba/core/errors';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { SwitchAccountCommand } from '../commands';
import { SwitchAccountBodyDTO } from '../dtos';
import { FindOrganizerQuery } from '../queries';
import { FindAccountOrganizersQuery } from '../queries/find-account-organizers/find-account-organizers.query';

@Controller({
  path: 'organizers',
  version: '1',
})
export class OrganizerController {
  constructor(readonly queryBus: QueryBus, readonly commandBus: CommandBus) {}

  @Get('accounts')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER)
  async findAccountOrganizers(@Identity() identity: IIdentity) {
    const query = new FindAccountOrganizersQuery({ userId: identity.id });
    return this.queryBus.execute(query);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async findSelf(@Identity() identity: IIdentity) {
    const query = new FindOrganizerQuery({ id: identity.id });
    return this.queryBus.execute(query);
  }

  @Post('switch-account')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async switchAccount(
    @Res({ passthrough: true }) res: Response,
    @Identity() identity: IIdentity,
    @Body() body: SwitchAccountBodyDTO,
    @Cookies('organizer_refresh_token') refreshToken: any,
  ) {
    if (!refreshToken) throw new AuthError.ForbiddenAccess();
    const command = new SwitchAccountCommand({ ...body, organizerId: identity.id });
    const token = await this.commandBus.execute(command);

    CookieUtils.set(res, 'organizer_refresh_token', token.refreshToken);

    return token;
  }
}
