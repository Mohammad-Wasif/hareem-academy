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

- `artifacts/frontend` — public marketing + enrollment website (root path `/`)
- `artifacts/backend` — Express API at `/api`
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

## Conversion / UX (April 2026)

The public site uses a centralized CTA system: `src/components/CTAGroup.tsx`
exposes a primary "Book Free Trial" (opens `EnrollmentModal` with
`mode="trial"`) and a secondary green "Chat on WhatsApp" button. Course
pages also use a course-specific "Enroll Now" CTA with the slug pre-filled.

Design pattern across pages: Hook → Pain → Transformation → Trust → repeated
CTAs. `EnrollmentModal` accepts a `mode` of `"trial" | "enroll"` and adds a
"We'll contact you on WhatsApp within minutes" trust line. The course detail
page has a sticky bottom action bar on mobile and a sticky sidebar on desktop.
Testimonials show colored initial avatars and country flags via the helpers
in `src/lib/country.ts`.
