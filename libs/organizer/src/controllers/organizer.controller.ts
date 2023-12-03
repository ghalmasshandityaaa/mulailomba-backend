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
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { FavoriteCommand, SwitchAccountCommand, UnfavoriteCommand } from '../commands';
import { FavoriteBodyDTO, FindAccountOrganizersQueryDTO, SwitchAccountBodyDTO } from '../dtos';
import { UnfavoriteBodyDTO } from '../dtos/unfavorite.body.dto';
import { FindAccountOrganizersQuery, FindOrganizerQuery } from '../queries';

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
  async findAccountOrganizers(
    @Identity() identity: IIdentity,
    @Query() qs: FindAccountOrganizersQueryDTO,
  ) {
    const query = new FindAccountOrganizersQuery({ userId: identity.id, ...qs });
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

  @Post('favorite')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER)
  async favoriteOrganizer(@Identity() identity: IIdentity, @Body() body: FavoriteBodyDTO) {
    const command = new FavoriteCommand({ organizerId: body.id, userId: identity.id });
    return await this.commandBus.execute(command);
  }

  @Post('unfavorite')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER)
  async unfavoriteOrganizer(@Identity() identity: IIdentity, @Body() body: UnfavoriteBodyDTO) {
    const command = new UnfavoriteCommand({ organizerId: body.id, userId: identity.id });
    return await this.commandBus.execute(command);
  }
}
