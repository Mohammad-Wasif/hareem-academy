# Engineering Standards — React

Code quality guidelines for React components.

---

## 1. Component Rules
- **Functional Components**: Implement only functional components using React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`).
- **Inline Style Overrides**: To enable dynamic customization of headers, colors, backgrounds, and sizes without requiring tailwind recompilation, bind values using the `style` property:
  ```typescript
  style={{ color: primaryColor }}
  ```
- **Animations**: Use `framer-motion` for transitions (fadeUp, staggerContainer, fadeIn). Always wrap loops in `<AnimatePresence>` if elements are unmounted.

## 2. Forms & Controls
- For forms, implement controlled inputs bound to state variables.
- Wrap buttons in `EnrollmentModal` or custom trigger components for operations that modify database rows.
