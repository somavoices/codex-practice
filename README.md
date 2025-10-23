# Share-A-Book (MVP)

Share-A-Book is a fully local community book sharing platform. The MVP runs without external APIs, stores data with SQLite via Prisma, and keeps cover images in the local filesystem.

## Tech Stack

- Next.js 15 (App Router, TypeScript)
- NextAuth (Credentials provider)
- Prisma ORM + SQLite
- Tailwind CSS v4
- Docker single-container deployment

## Getting Started

1. Copy `.env.example` to `.env` and update the secrets if needed.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Apply the database schema and seed a starter user:

   ```bash
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

4. Launch the dev server:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` and sign in with `alice@example.com` / `password123`.

## Available Scripts

- `npm run dev` – Start Next.js in development mode.
- `npm run build` – Build the production bundle.
- `npm start` – Run the production server.
- `npm run lint` – Lint the codebase.
- `npm run prisma:migrate` – Run interactive migrations in development.
- `npm run prisma:generate` – Regenerate Prisma Client.
- `npm run prisma:seed` – Seed the database with starter data.
- `npm run db:deploy` – Deploy migrations and seed in production.

## Docker Workflow

1. Build and run:

   ```bash
   docker compose -f docker/docker-compose.yml up --build
   ```

2. The app is served at `http://localhost:3000`. Local uploads and the SQLite file are mounted for persistence.

## Project Structure

```
app/         # Next.js routes, UI pages, API handlers
backend/     # Auth config, Prisma helpers, service layer
components/  # Reusable UI components
prisma/      # Schema, migrations, seeds
public/      # Static assets and uploaded book covers
docker/      # Container build definitions
```

## Testing

Prepare a dedicated SQLite database (runs migrations + seeds into `test.db`):

```bash
npm run db:test:prepare
```

Run unit tests (Vitest) covering the Prisma service layer:

```bash
npm run test:unit
```

Execute the automated smoke test (Playwright) that registers a user, shares a book, submits a borrow request, and approves it:

```bash
npm run test:e2e
```

Use `npm run test:e2e:headed` to watch the browser while the smoke test executes.
