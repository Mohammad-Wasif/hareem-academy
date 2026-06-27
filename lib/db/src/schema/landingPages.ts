import { pgTable, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const landingPagesTable = pgTable("landing_pages", {
  slug: varchar("slug", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  metaDescription: text("meta_description"),
  config: jsonb("config").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type LandingPage = typeof landingPagesTable.$inferSelect;
export type NewLandingPage = typeof landingPagesTable.$inferInsert;
