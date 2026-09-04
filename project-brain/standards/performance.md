# Engineering Standards — Performance

Guidelines for asset delivery and page performance.

---

## 1. Asset Optimization
- **Image Compression**: Utilize Cloudinary's dynamic compression features (`f_auto,q_auto`) to optimize file transfer sizes.
- **WEBP Conversion**: Avoid serving raw PNGs/JPEGs directly. Always transform images into compressed formats.

## 2. Bundle Optimization
- **Lazy Loading**: Import public routes and admin layout screens using React's lazy dynamic loader (`React.lazy`) to minimize initial script loads.
- **Wouter routing**: Use lightweight routers rather than bloated packages to keep bundle sizes compact.
