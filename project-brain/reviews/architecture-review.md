# Review Checklist — Architectural Integrity

Guidelines to verify codebase packages separation boundaries.

---

## 1. Monorepo Alignment
- [ ] Are backend changes isolated from frontend screens code?
- [ ] Are database schema modifications defined purely inside `lib/db/src/schema/`?
- [ ] Did you avoid introducing circular dependencies between workspace packages?

## 2. Dynamic Configurations
- [ ] Are new options correctly structured inside database configurations instead of being hardcoded?
