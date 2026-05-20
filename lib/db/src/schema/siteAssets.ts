import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const siteAssetsTable = pgTable("site_assets", {
  key: varchar("key", { length: 255 }).primaryKey(),
  url: text("url").notNull(),
  publicId: text("public_id").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
