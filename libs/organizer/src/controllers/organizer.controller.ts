import { Identity, IIdentity, RolePermission, Roles } from '@mulailomba/common';
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard, RoleGuard } from 'src/auth/guard';
import { FindOrganizerQuery } from '../queries';
import { FindAccountOrganizersQuery } from '../queries/find-account-organizers/find-account-organizers.query';

@Controller({
  path: 'organizers',
  version: '1',
})
export class OrganizerController {
  constructor(readonly queryBus: QueryBus) {}

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
}
