import { pgTable, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";

export const siteSettingsTable = pgTable("site_settings", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SiteSetting = typeof siteSettingsTable.$inferSelect;
export type NewSiteSetting = typeof siteSettingsTable.$inferInsert;
