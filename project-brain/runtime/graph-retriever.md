# Runtime Component — Graph Retriever

Directs graph node parsing.

---

## 1. Process Specifications
- Query the graph configuration file `/project-brain/graph/graph.json` or run the CLI helper.
- Find all direct imports/dependencies mapping to the target prompt request.
- Forward the list of nodes to the Context Loader.
