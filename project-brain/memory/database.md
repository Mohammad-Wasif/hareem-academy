# Project Memory — Database Schemas

Describes the Drizzle ORM relational schemas map.

---

## 1. Schema Tables Inventory

### `leads`
- **Purpose**: Track student search inquiries.
- **Columns**: `id` (serial), `fullName`, `whatsappNumber`, `email`, `source`, `assignedTo` (assigned teacher), `createdAt`.

### `enrollments`
- **Purpose**: Student seat reservations.
- **Columns**: `id` (serial), `fullName`, `age`, `whatsappNumber`, `city`, `country`, `courseSlug`, `notes`, `customData` (JSONB form answers), `assignedTo`, `createdAt`.

### `landing_pages`
- **Purpose**: Dynamic page builder templates.
- **Columns**: `slug` (varchar primary key), `title`, `metaDescription`, `config` (JSONB containing sections layout, text contents, and custom theme presets), `updatedAt`.

### `site_settings`
- **Purpose**: Platform configurations.
- **Columns**: `key` (varchar primary key), `value` (JSONB setting block values), `updatedAt`.

### `site_assets`
- **Purpose**: Cloudinary media file registry.
- **Columns**: `key`, `url`, `title`, `description`, `altText`, `tags`, `bytes`, `width`, `height`, `createdAt`.

### `dashboard_tasks`
- **Purpose**: Dashboard checklists.
- **Columns**: `id` (serial), `text`, `completed` (boolean), `createdAt`.
