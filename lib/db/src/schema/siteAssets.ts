import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const siteAssetsTable = pgTable("site_assets", {
  key: varchar("key", { length: 255 }).primaryKey(),
  url: text("url").notNull(),
  publicId: text("public_id").notNull(),
  title: text("title"),
  description: text("description"),
  altText: text("alt_text"),
  tags: text("tags"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
