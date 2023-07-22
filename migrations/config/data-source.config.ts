import * as dotenv from 'dotenv';
import { Migrations } from 'migrations';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

dotenv.config({
  path: resolve(process.cwd(), '.env'),
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.PG_DATABASE_URL,
  migrations: Migrations,
});
