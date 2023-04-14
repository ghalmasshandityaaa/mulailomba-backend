import { Public } from '@aksesaja/common';
import { Controller, Get, Header } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { InjectDataSource } from '@nestjs/typeorm';
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
  check() {
    return this.health.check([
      async () =>
        this.db.pingCheck('database', {
          connection: this.dataSource,
          timeout: 1000,
        }),
    ]);
  }
}
