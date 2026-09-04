# Engineering Standards — Security

Guidelines to maintain security and privacy across the platform.

---

## 1. Authentication & Authorization
- **Require Admin Middleware**: Any API endpoint that retrieves or modifies operational data (leads, enrollments, settings, builder configurations) must register the `requireAdmin` middleware.
- **Session Verification**: Do not trust request payloads for administrative identities; verify session cookie configurations on the backend.

## 2. Privacy & Data Safety
- **Strict Female-Only Feeds**: Do not expose student contact numbers or enrollment details on public-facing pages.
- **SQL Injection Prevention**: Use Drizzle ORM's parameterized query syntax. Never interpolate raw user inputs into SQL strings directly.
- **XSS Prevention**: Clean/sanitize any dynamic visual canvas strings or text fields before rendering.
