# Project Memory — Client & Server Routing

Details client routing paths and server REST endpoints.

---

## 1. Client App Routes (`App.tsx`)

### Core Public Paths
- `/` → `Home.tsx` (fetches override slug `"home"`)
- `/about` → `About.tsx`
- `/courses` → `Courses.tsx`
- `/courses/:slug` → `CourseDetail.tsx`
- `/privacy` → `Privacy.tsx` (fetches override slug `"privacy"`)
- `/terms` → `Terms.tsx` (fetches override slug `"terms"`)
- `/refund` → `Refund.tsx` (fetches override slug `"refund"`)

### Catch-All Landing Pages
- `/:slug` → `SEOLandingPage.tsx`
  - Dynamically resolved at runtime: queries the backend database for `slug`. If found, renders dynamically with custom themes. If not found, returns the `NotFound` page.

### Administrative Console Paths
- `/admin/login` → Login form
- `/admin` → Main stats board
- `/admin/builder` → Page builder
- `/admin/media` → Cloudinary manager
- `/admin/settings` → Global settings

## 2. Server API Endpoints
- `GET /api/landing-pages/:slug` (Public)
- `GET /api/admin/landing-pages` (Admin)
- `POST /api/admin/landing-pages` (Admin)
- `PUT /api/admin/landing-pages/:slug` (Admin)
- `DELETE /api/admin/landing-pages/:slug` (Admin)
