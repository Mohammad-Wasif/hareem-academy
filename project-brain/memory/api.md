# Project Memory — REST API Contracts

Details communication contracts between frontend and backend.

---

## 1. Landing Pages Endpoint Specs

### `GET /api/landing-pages/:slug`
- **Access**: Public
- **Response**:
```json
{
  "slug": "learn-arabic-online-for-sisters",
  "title": "Learn Arabic Online...",
  "metaDescription": "Description...",
  "config": {
    "sections": [
      { "id": "hero", "visible": true }
    ],
    "theme": {
      "fontFamily": "serif",
      "primaryColor": "#0F4D36",
      "accentColor": "#ECC565",
      "backgroundColor": "#FDFCF7",
      "baseFontSize": "base"
    },
    "heroTitle": "...",
    "heroSubtitle": "..."
  }
}
```

### `PUT /api/admin/landing-pages/:slug`
- **Access**: Admin session cookie required
- **Payload**: `title`, `metaDescription`, `config` (JSON block)
- **Response**: Updated DB record object.
