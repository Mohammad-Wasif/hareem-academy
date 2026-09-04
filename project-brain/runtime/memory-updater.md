# Runtime Component — Memory Updater

Directs the incremental knowledge sync updates.

---

## 1. Process Specifications
- Following an approved execution, determine which memory domains were affected.
- Apply targeted text updates to files in `project-brain/memory/`.
- Never rewrite unaffected files.
