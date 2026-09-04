# Runtime Component — Graph Updater

Directs graph edits on file creation/deletion.

---

## 1. Process Specifications
- If new components or endpoints are added, append new nodes and edges in `/project-brain/graph/graph.json`.
- If resources are removed, delete corresponding entries.
