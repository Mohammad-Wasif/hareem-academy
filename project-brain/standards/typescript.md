# Engineering Standards — TypeScript

Code quality guidelines for TypeScript implementations.

---

## 1. Type Safety Rules
- **No Implicit Any**: All variables, parameters, and return types must be explicitly typed unless contextually inferred.
- **Strict Constant Casts**: For union types (like fonts, device orientations, page statuses), enforce casting using constant values to avoid compiler mismatches:
  ```typescript
  fontFamily: "serif" as const
  ```
- **Null Safety**: Always check for undefined or null states on database queries before accessing child values.

## 2. Async Execution Checks
- Enforce `async/await` syntax for database query promises rather than `.then()` chaining inside backend routes.
- Catch all async throws using `try/catch` and log structured error objects.
