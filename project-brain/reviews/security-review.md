# Review Checklist — Security & Data Safety

Guidelines to identify vulnerabilities before merging changes.

---

## 1. Authentication Check
- [ ] Are new administrative API routes protected by the `requireAdmin` middleware check?
- [ ] Is input validation enforced on incoming HTTP requests?

## 2. SQL Protection
- [ ] Are all database operations safe from SQL injection (e.g. using Drizzle's ORM helper bindings)?
- [ ] Are student phone numbers and private details hidden from public queries?
