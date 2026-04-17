# SavdoBot

SavdoBot is a Next.js app with an AI assistant and Prisma support for PostgreSQL.
Main business entities (sales, expenses, debts, clients, reminders) are persisted in PostgreSQL.

## Local run

1. Copy env file:
   - `cp .env.example .env`
2. Fill required values in `.env`:
   - `DEEPSEEK_API_KEY`
   - `DATABASE_URL`
3. Install dependencies:
   - `npm install`
4. Start development server:
   - `npm run dev`

If you run for the first time, apply database migrations:
- `npm run db:migrate:deploy`

## Railway deploy (Next.js + Railway PostgreSQL)

1. Create a new Railway project and deploy this repository.
2. Add a PostgreSQL service in the same Railway project.
3. In app service variables, set:
   - `DATABASE_URL` (use Railway Postgres connection string)
   - `DEEPSEEK_API_KEY`
   - `NODE_ENV=production`
4. Railway will run:
   - Build: `npm run build`
   - Start: `npm run start`

`npm run start` is configured to:
- apply migrations: `prisma migrate deploy`
- start Next.js on Railway port: `next start --hostname :: --port ${PORT:-3000}`

## Database commands

- Generate Prisma client: `npm run db:generate`
- Run local migration: `npm run db:migrate:dev`
- Apply production migrations: `npm run db:migrate:deploy`
- Open Prisma Studio: `npm run db:studio`
