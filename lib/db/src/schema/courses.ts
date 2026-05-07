import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export type CurriculumModule = { title: string; description?: string };

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  language: text("language").notNull(),
  level: text("level").notNull(),
  durationMonths: integer("duration_months").notNull(),
  timings: text("timings").notNull(),
  platform: text("platform").notNull(),
  feeMonthly: integer("fee_monthly").notNull(),
  currency: text("currency").notNull().default("INR"),
  startDate: text("start_date"),
  summary: text("summary").notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
  curriculum: jsonb("curriculum")
    .$type<CurriculumModule[]>()
    .notNull()
    .default([]),
  forWhom: text("for_whom"),
  seatsRemaining: integer("seats_remaining"),
  featured: boolean("featured").notNull().default(false),
  title_ur: text("title_ur"),
  summary_ur: text("summary_ur"),
  timings_ur: text("timings_ur"),
  title_ar: text("title_ar"),
  summary_ar: text("summary_ar"),
  timings_ar: text("timings_ar"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Course = typeof coursesTable.$inferSelect;
