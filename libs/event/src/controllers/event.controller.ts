import { Identity, IIdentity, RolePermission, Roles } from '@mulailomba/common';
import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard, RoleGuard } from 'src/auth/guard';

@Controller({
  path: 'events',
  version: '1',
})
export class EventController {
  constructor(readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async createEvent(@Identity() identity: IIdentity) {}
}
