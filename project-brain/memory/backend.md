# Project Memory — Backend Stack

Describes the Node.js Express.js server stack.

---

## 1. Core Stack
- **Framework**: Express.js with TypeScript compilation.
- **Data Access**: Connects to Neon PostgreSQL using Drizzle ORM.
- **Log Engine**: Pino logging middleware.

## 2. Component Design
- **Entrypoint**: `artifacts/backend/src/app.ts` initializes DB pools, CORS headers, cookies, and registers the root router.
- **Routers Index**: `artifacts/backend/src/routes/index.ts` mounts sub-routers:
  - `/api/courses`
  - `/api/enrollments`
  - `/api/leads`
  - `/api/testimonials`
  - `/api/faqs`
  - `/api/landing-pages` (CRUD page builder)
  - `/api/admin` (Dashboard stats, tasks checklist updates, global settings JSON operations)
- **Security Check Middleware**: `artifacts/backend/src/lib/adminAuth.ts` exports `requireAdmin` which checks session cookies to restrict access to admin panel APIs.
