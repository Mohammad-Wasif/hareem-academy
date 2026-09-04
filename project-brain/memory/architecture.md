# Project Memory — Repository Architecture

Hareem Academy is structured as a pnpm monorepo.

---

## 1. Directory Tree Map

```
/
├── artifacts/
│   ├── backend/            # Express.js backend REST API application
│   └── frontend/           # React.js Vite SPA client app
├── lib/
│   └── db/                 # Shared database schema library (Drizzle ORM)
├── project-brain/          # AI Engineering Runtime metadata layers
└── package.json            # Global scripts and workspace configs
```

## 2. Package Responsibilities
- **`lib/db`**: House schemas and Drizzle push configs. Shared across local packages.
- **`artifacts/backend`**: Hosts API router controller scripts, requireAdmin session check middleware, and database connect hooks.
- **`artifacts/frontend`**: Renders SPA screens (admin panels, home, courses catalogs, legal documents, public landing pages). Uses `wouter` for lightweight routing.
