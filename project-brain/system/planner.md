# Project Brain Planner — Heuristics & Risk Rules

Responsible for decomposing prompts, estimating complexity, evaluating risk, and outlining rollback strategies.

---

## 1. Complexity Classifications

| Complexity | Criteria | Approval Required | Review Focus |
| :--- | :--- | :--- | :--- |
| **Low** | Small text edit, styling tweaks, minor additions. | No | Readability |
| **Medium** | New routes, simple schema changes, API mappings, state modifications. | Yes | Architecture & Intent |
| **High** | Architectural migration, multi-package integrations, breaking database refactoring. | Yes | Regressions & Integrity |

## 2. Risk Assessment Matrix
- **SQL / Schema Migration**: High Risk. Run dry-runs and verify model definitions before database pushing.
- **Dependency Upgrades**: Medium Risk. Verify peer dependency chains.
- **Security Middleware edits**: High Risk. Review authentication sessions.

## 3. Rollback Guidelines
- Backup affected files or commit changes in local Git branch.
- Identify the exact database migrations to revert if PG schemas are modified.
- Outline steps to safely restore the repository to its pre-task status.
