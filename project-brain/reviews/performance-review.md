# Review Checklist — Performance & Assets Optimization

Guidelines to optimize speed and efficiency.

---

## 1. Media Assets
- [ ] Are custom images and logos routed through Cloudinary's dynamic compression features?
- [ ] Did you verify that size dimensions or layouts do not trigger layout shifts?

## 2. Code Splitting
- [ ] Are large page screens dynamically imported via `React.lazy`?
