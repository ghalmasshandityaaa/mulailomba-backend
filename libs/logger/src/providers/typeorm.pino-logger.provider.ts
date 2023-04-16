import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Logger } from 'typeorm';

const HEARTBEAT_QUERY = 'SELECT 1';
const SCHEMA_DISCOVERY_QUERY = 'SELECT * FROM current_schema()';
const SERVER_VERSION_QUERY = 'SHOW server_version;';

export class TypeOrmPinoLoggerProvider implements Logger {
  constructor(
    @InjectPinoLogger('TypeOrm')
    readonly logger: PinoLogger,
  ) {}

  logQuery(query: string, parameters?: any[]) {
    const method = `onQuery`;
    if (
      query !== HEARTBEAT_QUERY &&
      query !== SCHEMA_DISCOVERY_QUERY &&
      query !== SERVER_VERSION_QUERY
    ) {
      this.logger.debug({ method, query, parameters });
    }
  }

  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    const method = `onQueryError`;
    this.logger.error({
      method,
      query,
      parameters,
      error: error instanceof Error ? error.message : error,
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    const method = `onQuerySlow`;
    this.logger.warn({ method, query, parameters, duration: time });
  }

  logSchemaBuild(message: string) {
    const method = `onBuildSchema`;
    this.logger.debug({ method }, message);
  }

  logMigration(message: string) {
    const method = `onMigration`;
    this.logger.debug({ method }, message);
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    const method = 'log';
    let logFn;
    switch (level) {
      case 'log':
        logFn = this.logger.debug;
        break;
      case 'info':
        logFn = this.logger.info;
      case 'warn':
        logFn = this.logger.warn;
        break;
      default:
        break;
    }
    logFn({ method }, message);
  }
}
