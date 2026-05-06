import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const siteContentTable = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  en: text("en").notNull(),
  ur: text("ur"),
  ar: text("ar"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
