# Project Memory — Codebase Patterns

Common architectural structures and patterns used in the project.

---

## 1. Dynamic Override Fallbacks
To preserve speed and prevent downtime:
- Core pages and landing pages attempt to query the backend database.
- If the fetch throws or returns 404, the page transparently resolves using pre-defined local static configurations or translation files.
- Example: `Home.tsx` loads overrides on mount but defaults to `useTranslation` content if none exist.

## 2. Dynamic Style Property Mapping
- Custom page-level fonts and colors are mapped dynamically via inline `style` objects.
- This allows branding flexibility on a per-page basis without relying on class compiles.
- Example in `SEOLandingPage.tsx`:
```typescript
style={{
  backgroundColor: pageData.theme?.backgroundColor || '#FDFCF7',
  color: pageData.theme?.primaryColor || '#0F4D36'
}}
```

## 3. Session Authenticator
- Admin routes are secured by the `requireAdmin` middleware checking cookies.
- Admin dashboard pages rely on a parent `<AdminLayout>` check before mounting.
