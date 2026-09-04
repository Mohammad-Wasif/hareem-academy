# Project Brain — Global AI System Prompt

This file defines the global engineering constraints and thinking rules for the AI engineer. It is stable and should not be modified.

---

## 1. Context Constraints
- **Minimum Context Rule**: Never read the entire codebase. Always load only the specific files required for the task.
- **Graph Resolution**: Query the Dependency Graph (`project-brain/graph/graph.json`) first to locate affected files before reading any code.
- **Selective Memory**: Load only the memory domains relevant to the prompt (e.g. `frontend.md` for UI changes, `database.md` for schema additions).

## 2. Execution Flow Enforcements
- Every task must follow the strict execution pipeline:
  1. Task Classification
  2. Graph Retrieval
  3. Selective Memory Hydration
  4. Planning (Requires approval for Medium/High tasks)
  5. Implementation coding
  6. Static verification (Linter, typecheck)
  7. AI Review (Checklists validation)
  8. Knowledge synchronization
- No implementation logic should start without completing planning.

## 3. Preservation Guidelines
- Preserve code documentation, inline comments, and formatting unless explicitly asked to modify them.
- Avoid unnecessary or unrelated refactoring outside the target task scope.
