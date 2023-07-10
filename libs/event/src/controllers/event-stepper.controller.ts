import { Identity, IIdentity, RolePermission, Roles } from '@mulailomba/common';
import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard, RoleGuard } from 'src/auth/guard';

@Controller({
  path: 'event/steps',
  version: '1',
})
export class EventStepperController {
  constructor(readonly commandBus: CommandBus) {}

  @Post('1')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async postStep1(@Identity() identity: IIdentity) {
    //
  }

  @Get('1')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async getStep1(@Identity() identity: IIdentity) {
    //
  }

  @Post('2')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async postStep2(@Identity() identity: IIdentity) {
    //
  }

  @Get('2')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async getStep2(@Identity() identity: IIdentity) {
    //
  }

  @Post('3')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async postStep3(@Identity() identity: IIdentity) {
    //
  }

  @Get('3')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async getStep3(@Identity() identity: IIdentity) {
    //
  }

  @Post('4')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async postStep4(@Identity() identity: IIdentity) {
    //
  }

  @Get('4')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.ORGANIZER)
  async getStep4(@Identity() identity: IIdentity) {
    //
  }
}
