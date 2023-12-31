import { Public } from '@mulailomba/common';
import { Controller, Get, Header } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { InjectDataSource } from '@nestjs/typeorm';
import { pick } from 'lodash';
import { DataSource } from 'typeorm';

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  @Public()
  @Get()
  @Header('Cache-Control', 'no-cache')
  @HealthCheck()
  async check() {
    const database = await this.health.check([
      async () =>
        this.db.pingCheck('database', {
          connection: this.dataSource,
          timeout: 3000,
        }),
    ]);

    return {
      database: pick(database, 'status').status,
    };
  }

  @Get('tes')
  tes() {
    return 'ok';
  }
}
