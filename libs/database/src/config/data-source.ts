import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { Migrations } from '../migrations';
import { Seeds } from '../seeds';

dotenv.config({
  path: resolve(process.cwd(), '.env'),
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.PG_DATABASE_URL,
  migrations: [...Migrations, ...Seeds],
  ssl: process.env.PG_DATABASE_SSL === 'true' ? true : false,
});
