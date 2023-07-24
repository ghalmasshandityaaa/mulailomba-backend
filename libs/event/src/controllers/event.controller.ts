import { Identity, IIdentity, RolePermission, Roles } from '@mulailomba/common';
import { JwtAuthGuard, RoleGuard } from '@mulailomba/common/guards';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateEventCommand } from '../commands/create-event/create-event.command';
import { CreateEventBodyDTO } from '../dtos';

@Controller({
  path: 'events',
  version: '1',
})
export class EventController {
  constructor(readonly commandBus: CommandBus) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async createEvent(@Identity() identity: IIdentity, @Body() body: CreateEventBodyDTO) {
    const command = new CreateEventCommand({
      ...body,
      organizerId: identity.id,
      categories: body.eventCategories.map((category) => ({
        ...category,
        timelines: category.eventTimelines,
      })),
    });
    return this.commandBus.execute(command);
  }
}
