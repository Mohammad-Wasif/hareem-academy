# Runtime Component — Review Engine

Directs standards scoring.

---

## 1. Process Specifications
- Following a successful typecheck, parse the standards checklists under `project-brain/standards/` and `project-brain/reviews/`.
- Score each dimension (Architecture, Naming, Security, Readability) out of 100.
- Compute average overall score. Approve only if overall score is 90+.
