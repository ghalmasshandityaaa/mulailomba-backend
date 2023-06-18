import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindHomepagesQuery } from '../queries';

@Controller({
  path: 'banners',
  version: '1',
})
export class BannerController {
  constructor(readonly queryBus: QueryBus) {}

  @Get('homepage')
  @HttpCode(HttpStatus.OK)
  async findHomepage() {
    const query = new FindHomepagesQuery();
    return this.queryBus.execute(query);
  }
}
