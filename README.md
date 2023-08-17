## Description

MulaiLomba Backend services, built using NestJs, and the CQRS model.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Migrations

### Create Migrations

To create a migration file

```bash
$ yarn migration:create <migration-name>
```

And move it inside the corresponding service's migration folder: `migrations/*`

Add your migration to the `index.ts` (eg. `migrations/index.ts`)

### Create Seeder

To create a seeds file (must with prefix `seed-*`)

To create a seeder factory file (must with prefix `seed.<factory-name>.factory.ts`)

```bash
$ yarn migration:create seed-<seed-name>
```

And move seed inside the corresponding service's seed folder: `src/libs/database/src/seeds/index.ts`

Add your migration to the `index.ts` (eg. `seeds/index.ts`)

Rule:

- If your seeder uses constant data, please create a factory first
- If you used factory files to store data, migrate them back for deletion (`down/revert code`)
- If you don't use factory files, you can ignore the migration code back
- If you use another module for seed data (eg. `StringUtils`), you must adjust path declaration with (eg. `../../../common/src/utils`) instead of (eg. `@mualilomba/common`)

### Execute Migrations

Make sure you ONLY run the migrations/seed on your local database.

```.env
# make sure .env has the following
PG_DATABASE_URL=postgres://postgres:postgres@localhost:5432/<your-local-database-name>
```

To show the migrations/seed

```
$ yarn migration:show
```

And then run the migration/seed

```
$ yarn migration:run
```

The cloud environment database migrations will be run via CI/CD.

## Stay in touch

- Ghalmas Shanditya Putra Agung - [Github](https://github.com/ghalmasshandityaaa)
