# Hareem Academy — Local Setup Guide

This guide walks you through running the Hareem Academy website on your own
computer. The project is a single repository (a "monorepo") containing the
public website, the API server, and the shared database/code libraries that
they use.

## What's inside

```
artifacts/
  hareem-academy/   The public website + admin panel (React + Vite)
  api-server/       The backend API (Express)
  mockup-sandbox/   Optional design sandbox (not needed to run the site)

lib/
  api-spec/         OpenAPI contract for the API
  api-zod/          Generated Zod validators (from the OpenAPI spec)
  api-client-react/ Generated React Query hooks (from the OpenAPI spec)
  db/               Drizzle ORM schemas and database client
```

## 1. Prerequisites

Install these on your computer first:

| Tool        | Version           | How to get it                                 |
| ----------- | ----------------- | --------------------------------------------- |
| Node.js     | 20 or newer       | https://nodejs.org/ (pick the LTS version)    |
| pnpm        | 10 or newer       | `npm install -g pnpm`                         |
| PostgreSQL  | 14 or newer       | https://www.postgresql.org/download/          |
| Git         | any recent        | https://git-scm.com/downloads                 |

Confirm each is installed:

```bash
node --version
pnpm --version
psql --version
git --version
```

## 2. Get the code

```bash
git clone <your-repo-url> hareem-academy
cd hareem-academy
```

## 3. Install dependencies

From the project root:

```bash
pnpm install
```

This installs everything for every package in the monorepo.

## 4. Create a PostgreSQL database

Open a terminal and run:

```bash
psql -U postgres
```

Then inside the `psql` prompt:

```sql
CREATE DATABASE hareem_academy;
CREATE USER hareem WITH PASSWORD 'changeme';
GRANT ALL PRIVILEGES ON DATABASE hareem_academy TO hareem;
\q
```

Your connection string will be:

```
postgres://hareem:changeme@localhost:5432/hareem_academy
```

## 5. Configure environment variables

You need two `.env` files — one for the API server and one for the website.

### `artifacts/api-server/.env`

```env
# Database
DATABASE_URL=postgres://hareem:changeme@localhost:5432/hareem_academy

# Port the API listens on
PORT=8080

# A long random string used to sign session cookies
# Generate one with:  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
SESSION_SECRET=replace-with-a-long-random-string

# The password for the admin panel (username is always "admin")
ADMIN_PASSWORD=pick-a-strong-password
```

### `artifacts/hareem-academy/.env`

```env
PORT=5173
BASE_PATH=/
```

> The website talks to the API through a relative `/api/...` URL. In Replit
> this works automatically because both services share a proxy. When running
> locally you'll use the small Vite proxy described in step 7 below.

## 6. Push the database schema

This creates all the tables (courses, enrollments, contact messages, leads,
testimonials, FAQs):

```bash
# From the project root
DATABASE_URL=postgres://hareem:changeme@localhost:5432/hareem_academy \
  pnpm --filter @workspace/db run push
```

If it asks you to confirm any "destructive" change on a fresh database, you can
also run:

```bash
DATABASE_URL=... pnpm --filter @workspace/db run push-force
```

## 7. (Local only) Add a Vite proxy so the frontend can reach the API

When running on Replit, both the website and API are served through the same
host on `/` and `/api`. Locally they run on different ports, so add a small
proxy to the Vite config so that API calls keep working without code changes.

Open `artifacts/hareem-academy/vite.config.ts` and add a `server.proxy` block:

```ts
export default defineConfig({
  // ...existing config...
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 5173),
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
```

This step is **only needed for local development** — do not commit this change
back to the Replit setup.

## 8. Run the project

Open two terminals.

**Terminal 1 — API server:**

```bash
pnpm --filter @workspace/api-server run dev
```

You should see something like `Server listening on port 8080`.

**Terminal 2 — Website:**

```bash
pnpm --filter @workspace/hareem-academy run dev
```

Open the URL it prints (usually http://localhost:5173).

## 9. Log into the admin panel

1. Visit http://localhost:5173/admin/login
2. Username: `admin`
3. Password: whatever you put in `ADMIN_PASSWORD`

From there you can add your first courses, testimonials, and FAQs. Anything
you add shows up immediately on the public site.

## Useful commands

Run from the project root.

| Command                                                          | What it does                              |
| ---------------------------------------------------------------- | ----------------------------------------- |
| `pnpm install`                                                   | Install all dependencies                  |
| `pnpm --filter @workspace/api-server run dev`                    | Start the API in dev mode                 |
| `pnpm --filter @workspace/hareem-academy run dev`                | Start the website in dev mode             |
| `pnpm --filter @workspace/db run push`                           | Sync the database schema                  |
| `pnpm --filter @workspace/api-spec run codegen`                  | Regenerate API hooks/Zod from OpenAPI     |
| `pnpm run typecheck`                                             | TypeScript check across every package     |
| `pnpm --filter @workspace/api-server run build`                  | Build the production API bundle           |
| `pnpm --filter @workspace/hareem-academy run build`              | Build the production website              |

## Building for production

```bash
# Build the website (static files)
pnpm --filter @workspace/hareem-academy run build

# Build the API server
pnpm --filter @workspace/api-server run build

# Run the production API
node artifacts/api-server/dist/index.mjs
```

The website's built static files end up in
`artifacts/hareem-academy/dist/public/` and can be served by any static host
(Nginx, Vercel, Netlify, S3, etc.). Make sure the host points all `/api/*`
requests to the running API server.

## Troubleshooting

**`Cannot connect to the database`**
Double-check `DATABASE_URL` and that PostgreSQL is running. On macOS:
`brew services start postgresql`. On Linux: `sudo systemctl start postgresql`.

**`SESSION_SECRET environment variable is required`**
Make sure `artifacts/api-server/.env` exists and contains `SESSION_SECRET`.

**Admin login returns "Invalid credentials"**
Username must be exactly `admin` (lowercase). The password must match
`ADMIN_PASSWORD` in `artifacts/api-server/.env`. Restart the API server after
changing the value.

**Website loads but API calls fail with HTML / 404**
You probably skipped step 7 (Vite proxy). The website needs a way to forward
`/api/*` calls to the API server when running locally.

**`pnpm install` errors about `Use pnpm instead`**
You ran `npm install` by accident. Delete `package-lock.json` and run
`pnpm install`.
