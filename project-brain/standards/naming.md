# Engineering Standards — Naming Conventions

Strict nomenclature rules for file naming and code patterns.

---

## 1. File Nomenclature
- **React Components / Page Screens**: Use PascalCase (e.g. `AdminBuilder.tsx`, `SEOLandingPage.tsx`, `CourseCard.tsx`).
- **Database Schemas / Routes**: Use camelCase (e.g. `landingPages.ts`, `siteSettings.ts`, `dashboardTasks.ts`).
- **Scripts**: Use kebab-case or lower-case (e.g. `query-brain.mjs`, `drizzle-push.mjs`).

## 2. Code Variable Nomenclature
- **React State Hooks**: Use `activePage` / `setActivePage` structure.
- **Drizzle Table References**: Suffix database tables with `Table` (e.g. `landingPagesTable`, `siteSettingsTable`).
- **REST Endpoints Paths**: Suffix collection routes appropriately (e.g. `/api/landing-pages`, `/api/admin/tasks`).
