# Hareem Academy

## Overview

A complete website for Hareem Academy — an online Arabic & Urdu language school
exclusively for girls and women. Visitors can browse courses, enroll directly,
contact the team, capture leads (free Arabic alphabet PDF), and connect via
WhatsApp.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Frontend**: React 19 + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Express 5 + Drizzle ORM + PostgreSQL
- **Validation**: Zod (shared schemas via Orval-generated `@workspace/api-zod`)
- **API codegen**: Orval (React Query hooks + Zod schemas from OpenAPI spec)
- **Routing**: wouter
- **Forms**: react-hook-form + @hookform/resolvers/zod

## Artifacts

- `artifacts/hareem-academy` — public marketing + enrollment website (root path `/`)
- `artifacts/api-server` — Express API at `/api`
- `artifacts/mockup-sandbox` — design sandbox (not used for the live site)

## API surface (`/api`)

- `GET /healthz`, `GET /courses`, `GET /courses/:slug`
- `POST /enrollments`, `POST /contact`, `POST /leads`
- `GET /testimonials`, `GET /stats`, `GET /faqs`

## Database

- Tables: `courses`, `enrollments`, `contact_messages`, `leads`,
  `testimonials`, `faqs`. Seeded with three courses, six testimonials, and
  nine FAQs.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and
  Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Brand

- Deep Islamic green primary, warm gold accents, soft cream background.
- Pairs an elegant serif (Cormorant Garamond) for headings with DM Sans for
  body and Amiri for Arabic / Urdu.
- WhatsApp contact: `+91 9315118289` (https://wa.me/919315118289).
