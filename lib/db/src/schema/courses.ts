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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Course = typeof coursesTable.$inferSelect;
