# Engineering Standards — Documentation

Rules for documenting the codebase.

---

## 1. Comments & Docstrings
- Preserve all existing inline comments, docstrings, and context explanations when modifying files.
- If implementing complex logic, add a single concise header comment explaining the intent. Avoid verbose, redundant commenting of obvious loops.

## 2. API Specifications
- Any modifications to the database schema or endpoint routers must immediately reflect as dynamic updates in `project-brain/memory/database.md` and `project-brain/memory/api.md` during the Knowledge Sync stage.
