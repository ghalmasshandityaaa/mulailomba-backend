import { RolePermission, Roles } from '@mulailomba/common';
import { JwtAuthGuard, RoleGuard } from '@mulailomba/common/guards';
import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindCategoriesQueryDTO } from '../dtos';
import { FindCategoriesQuery } from '../queries/find-categories/find-categories.query';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoryController {
  constructor(readonly queryBus: QueryBus) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RolePermission.USER, RolePermission.ORGANIZER)
  async findHomepage(@Query() qs: FindCategoriesQueryDTO) {
    const query = new FindCategoriesQuery(qs);
    return this.queryBus.execute(query);
  }
}
