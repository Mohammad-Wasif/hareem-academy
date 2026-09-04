# Project Memory — Frontend Stack

Describes the React SPA client stack.

---

## 1. Core Stack
- **Framework**: React 18, Vite bundler.
- **Client Routing**: `wouter` lightweight client router.
- **API Fetching**: `@tanstack/react-query` for server caches and queries.
- **Client Client Map**: `/artifacts/frontend/src/lib/adminApi.ts` houses fetch wrappers.

## 2. Layouts & Visual Controls
- **Visual page builder**: `/src/pages/admin/AdminBuilder.tsx` allows visual reordering, metadata audits, and page-specific font/color theme updates.
- **Media console**: `/src/pages/admin/AdminMedia.tsx` streams uploads directly to Cloudinary and registers rows.
- **Dynamic CSS Injection**: Dynamic values are bound inline (e.g. `fontFamily`, `primaryColor`, `accentColor`, `backgroundColor`) to containers, letting admins styling pages on the fly.
