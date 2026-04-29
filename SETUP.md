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

## Putting your database on Neon

[Neon](https://neon.tech) is a hosted PostgreSQL service with a generous free
plan. It's the easiest way to give your live website a permanent database.

### Step A — Create the Neon database

1. Go to https://neon.tech and sign up (the free plan is enough to start).
2. Click **Create Project**. Pick any project name (e.g. `hareem-academy`),
   any region close to your students, and PostgreSQL 16.
3. After the project is created, Neon shows a **connection string** that looks
   like:

   ```
   postgresql://USER:PASSWORD@ep-xxxx-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

   Copy this string and keep it safe — it is your `DATABASE_URL`.

### Step B — Push the schema into Neon

From your computer, with the project already cloned (steps 1–3 above):

```bash
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx-...neon.tech/neondb?sslmode=require" \
  pnpm --filter @workspace/db run push
```

This creates every table (courses, enrollments, contact messages, leads,
testimonials, FAQs, form fields) inside Neon. You only need to do this once,
and again any time you change the database schema in the code.

> **Tip:** Whenever you update the Neon `DATABASE_URL` (for example, after
> rotating the password), re-paste the new value into Render's environment
> variables and restart the API service.

### Step C — (optional) Inspect your Neon data

Neon's web dashboard has a built-in **SQL Editor** under the *Tables* tab.
You can run queries like:

```sql
SELECT * FROM courses;
SELECT * FROM enrollments ORDER BY created_at DESC;
```

You don't need this for normal use — the admin panel covers all day-to-day
work — but it's handy when you want to look at the raw data.

## Deploying to Render

[Render](https://render.com) lets you host the API and the website together.
You'll create **two services**:

1. A **Web Service** for the API (Node).
2. A **Static Site** for the website (the React build).

### Step 1 — Push the project to GitHub

Render deploys from a Git repository.

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hareem-academy.git
git push -u origin main
```

### Step 2 — Deploy the API (Web Service)

1. In Render, click **New → Web Service** and connect your GitHub repo.
2. Fill the form like this:

   | Setting             | Value                                                              |
   | ------------------- | ------------------------------------------------------------------ |
   | Name                | `hareem-academy-api`                                               |
   | Region              | Pick the same region as your Neon database                         |
   | Branch              | `main`                                                             |
   | Runtime             | `Node`                                                             |
   | Build Command       | `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @workspace/api-server run build` |
   | Start Command       | `node artifacts/api-server/dist/index.mjs`                         |
   | Instance Type       | Free is fine to start                                              |

3. Open the **Environment** tab and add these variables:

   | Key              | Value                                                            |
   | ---------------- | ---------------------------------------------------------------- |
   | `DATABASE_URL`   | Your Neon connection string from above                           |
   | `SESSION_SECRET` | A long random string (run the generator from the local setup)    |
   | `ADMIN_PASSWORD` | The password you'll use to sign into `/admin`                    |
   | `NODE_ENV`       | `production`                                                     |
   | `NODE_VERSION`   | `20`                                                             |

4. Click **Create Web Service**. Render will build and start it. When it's
   live, copy the URL it gives you, e.g.
   `https://hareem-academy-api.onrender.com`. You'll need it in the next step.

5. Quick check: open `https://hareem-academy-api.onrender.com/api/healthz` in
   your browser. You should see a small JSON response.

### Step 3 — Deploy the website (Static Site)

1. In Render, click **New → Static Site** and pick the same GitHub repo.
2. Fill the form like this:

   | Setting             | Value                                                              |
   | ------------------- | ------------------------------------------------------------------ |
   | Name                | `hareem-academy`                                                   |
   | Branch              | `main`                                                             |
   | Build Command       | `corepack enable && pnpm install --frozen-lockfile && pnpm --filter @workspace/hareem-academy run build` |
   | Publish Directory   | `artifacts/hareem-academy/dist/public`                             |

3. Open the **Redirects/Rewrites** tab and add **two** rules in this order:

   | Source       | Destination                                                  | Action  |
   | ------------ | ------------------------------------------------------------ | ------- |
   | `/api/*`     | `https://hareem-academy-api.onrender.com/api/:splat`         | Rewrite |
   | `/*`         | `/index.html`                                                | Rewrite |

   The first rule sends every API call to your backend. The second rule lets
   the React router handle deep links like `/courses/quran-recitation` and
   `/admin/form-fields`.

4. Click **Create Static Site**. Render will build and publish it.

### Step 4 — Visit your live site

- Public site: `https://hareem-academy.onrender.com`
- Admin panel: `https://hareem-academy.onrender.com/admin/login`
  (username `admin`, password = whatever you set in `ADMIN_PASSWORD`).

> **Free tier note:** Render's free Web Service goes to sleep after ~15 minutes
> of inactivity. The first request after sleep takes 30–60 seconds while it
> wakes up. Upgrade the API service to a paid plan ($7/month) when you want it
> always-on.

### Step 5 — Use a custom domain (optional)

1. In your Static Site → **Settings → Custom Domain**, click **Add**.
2. Type your domain, e.g. `hareemacademy.com`.
3. Render shows you DNS records to add at your domain registrar (GoDaddy,
   Namecheap, Cloudflare, etc.). Add them, wait a few minutes, and Render
   issues a free HTTPS certificate automatically.
4. Repeat for the API if you want it on something like
   `api.hareemacademy.com` (and update the rewrite rule from step 3 to point
   to the new URL).

### Step 6 — Pushing future updates

Render redeploys automatically every time you push to GitHub:

```bash
git add .
git commit -m "Update homepage copy"
git push
```

Both the API and the website will rebuild and go live in a few minutes.

If you change the **database schema** (anything in `lib/db/src/schema/`), also
re-run the push command from your computer afterwards:

```bash
DATABASE_URL="<your Neon URL>" pnpm --filter @workspace/db run push
```

## Later — what to do as the school grows

A few things you'll want to consider once the site is live and being used:

### Backups

Neon takes automatic backups in the background, but you should also keep your
own copy of important data. Once a week or before any big change, run from
your computer:

```bash
pg_dump "$DATABASE_URL" > backup-$(date +%Y-%m-%d).sql
```

Store the resulting `.sql` file safely (Google Drive, Dropbox, etc.).

### Scaling up

When the site outgrows the free tier:

- **Render API** → upgrade to the **Starter** plan ($7/month). No more cold
  starts and more memory.
- **Neon** → the free tier covers ~190 active hours/month and 0.5 GB storage.
  Upgrade to **Launch** ($19/month) when you cross either limit.
- **Render Static Site** stays free forever (Render does not bill for static
  hosting bandwidth on small projects).

### Sending emails or WhatsApp notifications

The site currently shows a "we'll contact you" confirmation. To send automatic
emails (for example, an admission confirmation), you'll add an email provider
(Resend, SendGrid, or Postmark) and call it from the enrollment route in
`artifacts/api-server/src/routes/enrollments.ts`. Treat the API key the same
way as `ADMIN_PASSWORD` — store it as a Render environment variable.

### Adding new admin users

Right now the admin panel uses a single shared password. If you want more
people to manage the site (e.g. teachers managing their own courses), the next
step is to add a real users table with email + hashed password and migrate the
login to use it. Until then, you can simply share the `ADMIN_PASSWORD` with
trusted staff and rotate it every few months from Render's environment tab.

### Monitoring

- Render's **Logs** tab on the API service shows every request and any errors.
- Neon's **Monitoring** tab shows database CPU, connections, and storage.

Glance at both once a week so you catch problems early.

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
