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

Make sure you ONLY run the migrations on your local database.

```.env
# make sure .env has the following
PG_DATABASE_URL=postgres://postgres:postgres@localhost:5432/<your-local-database-name>
```

To show the migrations

```
$ yarn migration:show
```

And then run the migration

```
$ yarn migration:run
```

The cloud environment database migrations will be run via CI/CD.

## Stay in touch

- Ghalmas Shanditya Putra Agung - [Github](https://github.com/ghalmasshandityaaa)
