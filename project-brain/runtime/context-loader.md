# Runtime Component — Context Loader

Instructs the engine how to gather and inject selective memory domain documentation.

---

## 1. Process Specifications
- Receive the array of affected file paths and matched keyword nodes from the Graph Retriever.
- Read only the specific `.md` files under `project-brain/memory/` that match these keywords.
- Inject the gathered memory contents directly into the model's system context.
- Never append unreferenced code sheets.
