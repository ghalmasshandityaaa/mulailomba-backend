import { Identity, IIdentity, RolePermission, Roles } from '@mulailomba/common';
import { JwtAuthGuard, RoleGuard } from '@mulailomba/common/guards';
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindUserByIdQuery } from '../queries';

@Controller({
  version: '1',
  path: 'users',
})
export class UserController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findSelf(@Identity() identity: IIdentity) {
    const query = new FindUserByIdQuery({ userId: identity.id });
    return this.queryBus.execute(query);
  }
}
