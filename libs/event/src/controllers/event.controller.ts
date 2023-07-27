import { Identity, IIdentity, RolePermission, Roles } from '@mulailomba/common';
import { JwtAuthGuard, RoleGuard } from '@mulailomba/common/guards';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEventCommand } from '../commands/create-event/create-event.command';
import { CreateEventBodyDTO, FindEventByOrganizerIdQueryDTO } from '../dtos';
import { FindEventsByOrganizerIdQuery } from '../queries';

@Controller({
  path: 'events',
  version: '1',
})
export class EventController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

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

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async findByOrganizerId(
    @Identity() identity: IIdentity,
    @Query() params: FindEventByOrganizerIdQueryDTO,
  ) {
    const query = new FindEventsByOrganizerIdQuery({
      ...params,
      organizerId: identity.id,
    });

    console.log(10, params);
    return this.queryBus.execute(query);
  }
}
